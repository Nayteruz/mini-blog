import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import type { ICategory, ICreateCategoryData } from "../types";

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
	const createCategory = async (name: string, parentId: string | null = null) => {
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

			const newCategoryData: ICreateCategoryData = {
				name,
				parentId,
				path,
				depth,
				createdAt: new Date(),
				createdBy: "current_user",
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
		return categories.filter((category) => category.parentId === parentId);
	};

	// ПОСТРОЕНИЕ ДЕРЕВА КАТЕГОРИЙ
	const buildCategoryTree = (parentId: string | null = null): any[] => {
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
			const children = categories.filter((cat) => cat.parentId === parentId);
			children.forEach((category) => {
				result.push(category);
				addCategories(category.id, depth + 1);
			});
		};

		addCategories(null, 0);
		return result;
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
	};
};
