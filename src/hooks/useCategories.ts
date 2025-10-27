import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import type { ICategory, ICategoryTree, ICreateCategoryData, IUpdateCategoryData } from "../types";

export const useCategories = () => {
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Загрузка всех категорий
	const loadCategories = async () => {
		try {
			setLoading(true);
			setError(null);

			const q = query(collection(db, "categories"), orderBy("depth"));
			const querySnapshot = await getDocs(q);

			const categoriesData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as ICategory[];

			setCategories(categoriesData);
		} catch (err) {
			console.error("Error loading categories:", err);
			setError("Ошибка загрузки категорий");
		} finally {
			setLoading(false);
		}
	};

	// Создание новой категории
	const createCategory = async (name: string, parentId: string | null = null, userId: string) => {
		try {
			setError(null);

			let path: string[] = [];
			let depth = 0;

			if (parentId) {
				const parentCategory = categories.find((cat) => cat.id === parentId);
				if (parentCategory) {
					path = [...parentCategory.path];
					depth = parentCategory.depth + 1;
				} else {
					throw new Error("Родительская категория не найдена");
				}
			}

			const siblings = categories.filter((cat) => cat.parentId === parentId);
			const maxOrder = siblings.length > 0 ? Math.max(...siblings.map((cat) => cat.order)) : -1;
			const newOrder = maxOrder + 1;

			const newCategoryData: ICreateCategoryData = {
				name,
				parentId,
				path,
				depth,
				order: newOrder,
				createdAt: new Date(),
				createdBy: userId,
			};

			const docRef = await addDoc(collection(db, "categories"), newCategoryData);

			// Обновляем path с ID новой категории
			await updateDoc(doc(db, "categories", docRef.id), {
				path: [...path, docRef.id],
			});

			await loadCategories();
			return docRef.id;
		} catch (err) {
			console.error("Error creating category:", err);
			setError("Ошибка создания категории");
			throw err;
		}
	};

	// УДАЛЕНИЕ КАТЕГОРИИ
	const deleteCategory = async (categoryId: string) => {
		try {
			setError(null);

			// Проверяем, есть ли дочерние категории
			const childCategories = categories.filter((cat) => cat.parentId === categoryId);
			if (childCategories.length > 0) {
				throw new Error("Нельзя удалить категорию с дочерними элементами. Сначала удалите все подкатегории.");
			}

			// Удаляем категорию
			await deleteDoc(doc(db, "categories", categoryId));

			// Перезагружаем список
			await loadCategories();
		} catch (err) {
			console.error("Error deleting category:", err);
			setError(err instanceof Error ? err.message : "Ошибка удаления категории");
			throw err;
		}
	};

	// ПОЛУЧЕНИЕ ДОЧЕРНИХ КАТЕГОРИЙ
	const getChildCategories = (parentId: string | null): ICategory[] => {
		return categories.filter((category) => category.parentId === parentId).sort((a, b) => a.order - b.order); // ← СОРТИРУЕМ ПО ПОРЯДКУ
	};

	// ПОСТРОЕНИЕ ДЕРЕВА КАТЕГОРИЙ
	const buildCategoryTree = (parentId: string | null = null): ICategoryTree[] => {
		const children = getChildCategories(parentId);
		return children.map((category) => ({
			...category,
			children: buildCategoryTree(category.id),
		}));
	};

	// Получение дерева категорий (вычисляемое свойство)
	const categoryTree = buildCategoryTree();

	const getCategoriesForSelect = (): ICategory[] => {
		const result: ICategory[] = [];

		const addCategories = (parentId: string | null, depth: number) => {
			const children = getChildCategories(parentId);
			children.forEach((category) => {
				result.push(category);
				addCategories(category.id, depth + 1);
			});
		};

		addCategories(null, 0);
		return result;
	};

	// РЕДАКТИРОВАНИЕ КАТЕГОРИИ (название и родитель)
	const updateCategory = async (categoryId: string, name: string, newParentId: string | null) => {
		try {
			setError(null);

			// Находим редактируемую категорию
			const categoryToUpdate = categories.find((cat) => cat.id === categoryId);
			if (!categoryToUpdate) {
				throw new Error("Категория не найдена");
			}

			let newPath: string[] = [];
			let newDepth = 0;

			// Если родитель изменился, пересчитываем путь и глубину
			if (newParentId !== categoryToUpdate.parentId) {
				if (newParentId) {
					const newParent = categories.find((cat) => cat.id === newParentId);
					if (!newParent) {
						throw new Error("Новый родитель не найден");
					}
					newPath = [...newParent.path];
					newDepth = newParent.depth + 1;
				} else {
					// Стала корневой категорией
					newPath = [];
					newDepth = 0;
				}

				// Проверяем, не пытаемся ли сделать категорию родителем самой себе
				if (newPath.includes(categoryId)) {
					throw new Error("Нельзя сделать категорию родителем самой себе");
				}
			} else {
				// Родитель не изменился - оставляем старый путь и глубину
				newPath = categoryToUpdate.path;
				newDepth = categoryToUpdate.depth;
			}

			// Определяем порядок в новой родительской категории
			const newSiblings = categories.filter((cat) => cat.parentId === newParentId && cat.id !== categoryId);
			const maxOrder = newSiblings.length > 0 ? Math.max(...newSiblings.map((cat) => cat.order)) : -1;
			const newOrder = maxOrder + 1;

			const updateData: IUpdateCategoryData = {
				name,
				parentId: newParentId,
				path: newPath,
				depth: newDepth,
				order: newOrder,
				updatedAt: new Date(),
			};

			await updateDoc(doc(db, "categories", categoryId), { ...updateData });

			// Если изменился родитель, нужно обновить пути всех дочерних категорий
			if (newParentId !== categoryToUpdate.parentId) {
				await updateChildCategoriesPaths(categoryId, newPath);
			}

			await loadCategories(); // Перезагружаем список
		} catch (err) {
			console.error("Error updating category:", err);
			setError("Ошибка обновления категории");
			throw err;
		}
	};

	// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: обновление путей дочерних категорий
	const updateChildCategoriesPaths = async (parentId: string, parentPath: string[]) => {
		const childCategories = categories.filter((cat) => cat.parentId === parentId);

		for (const child of childCategories) {
			const newChildPath = [...parentPath, child.id];
			await updateDoc(doc(db, "categories", child.id), {
				path: newChildPath,
				depth: parentPath.length,
			});

			// Рекурсивно обновляем пути всех вложенных категорий
			await updateChildCategoriesPaths(child.id, newChildPath);
		}
	};

	// СОРТИРОВКА КАТЕГОРИЙ
	const reorderCategories = async (reorderedCategories: ICategory[]) => {
		try {
			setError(null);

			const batch = writeBatch(db);

			reorderedCategories.forEach((category, index) => {
				const categoryRef = doc(db, "categories", category.id);
				batch.update(categoryRef, {
					order: index,
					updatedAt: new Date(),
				});
			});

			await batch.commit();
			await loadCategories(); // Перезагружаем для обновления состояния
		} catch (err) {
			console.error("Error reordering categories:", err);
			setError("Ошибка изменения порядка категорий");
			throw err;
		}
	};

	useEffect(() => {
		loadCategories();
	}, []);

	return {
		categories,
		loading,
		error,
		refreshCategories: loadCategories,
		createCategory,
		deleteCategory,
		getChildCategories,
		categoryTree,
		getCategoriesForSelect,
		updateCategory,
		reorderCategories,
	};
};
