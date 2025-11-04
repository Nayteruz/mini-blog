import { useState, useEffect, useMemo } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/configDb";
import type { ICategory, ICategoryTree } from "../types";
import type {
  ICreateCategoryHookArguments,
  IUpdateCategoryHookArguments,
} from "./types";
import { DB_KEYS } from "./const";
import {
  buildCategoryTree,
  createCategoryData,
  getCategoriesForSelect,
  getChildCategories,
  getUpdatedCategories,
  updateCategoryData,
  updateChildCategoriesPaths,
} from "./utils";

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryTree, setCategoryTree] = useState<ICategoryTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Загрузка всех категорий
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, DB_KEYS.CATEGORIES),
        orderBy(DB_KEYS.DEPTH)
      );
      const querySnapshot = await getDocs(q);

      const categoriesData = querySnapshot.docs.map(doc => ({
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
  const createCategory = async (params: ICreateCategoryHookArguments) => {
    const { name, parentId, userId } = params;
    try {
      setError(null);

      const newCategoryData = createCategoryData({
        categories,
        name,
        parentId,
        userId,
      });

      const docRef = await addDoc(
        collection(db, DB_KEYS.CATEGORIES),
        newCategoryData
      );

      // Обновляем path с ID новой категории
      await updateDoc(doc(db, DB_KEYS.CATEGORIES, docRef.id), {
        path: [...newCategoryData.path, docRef.id],
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
      const childCategories = categories.filter(
        cat => cat.parentId === categoryId
      );
      if (childCategories.length > 0) {
        throw new Error(
          "Нельзя удалить категорию с дочерними элементами. Сначала удалите все подкатегории."
        );
      }

      // Удаляем категорию
      await deleteDoc(doc(db, DB_KEYS.CATEGORIES, categoryId));

      // Перезагружаем список
      await loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка удаления категории"
      );
      throw err;
    }
  };

  // РЕДАКТИРОВАНИЕ КАТЕГОРИИ (название и родитель)
  const updateCategory = async (params: IUpdateCategoryHookArguments) => {
    const { categoryId, name, newParentId } = params;
    const originalCategories = [...categories];

    try {
      setError(null);

      const categoryToUpdate = categories.find(cat => cat.id === categoryId);

      if (!categoryToUpdate) {
        throw new Error("Категория не найдена");
      }

      const { updateData, newPath, updatedCategories } = updateCategoryData({
        categories,
        categoryToUpdate,
        categoryId,
        name,
        newParentId,
        setCategories,
      });

      setCategories(updatedCategories);

      await updateDoc(doc(db, DB_KEYS.CATEGORIES, categoryId), {
        ...updateData,
      });

      // Если изменился родитель, нужно обновить пути всех дочерних категорий
      if (newParentId !== categoryToUpdate.parentId) {
        await updateChildCategoriesPaths(categories, categoryId, newPath);
      }

      await loadCategories();
    } catch (err) {
      setCategories(originalCategories);
      console.error("Error updating category:", err);
      setError("Ошибка обновления категории");
      throw err;
    }
  };

  // СОРТИРОВКА КАТЕГОРИЙ
  const reorderCategories = async (reorderedCategories: ICategory[]) => {
    const originalCategories = [...categories];

    const updatedCategories = getUpdatedCategories(
      categories,
      reorderedCategories
    );

    setCategoryTree(buildCategoryTree(updatedCategories, null));

    try {
      setIsReordering(true);
      setError(null);

      const batch = writeBatch(db);

      reorderedCategories.forEach((category, index) => {
        const categoryRef = doc(db, DB_KEYS.CATEGORIES, category.id);
        batch.update(categoryRef, {
          order: index,
          updatedAt: new Date(),
        });
      });

      await batch.commit();
      await loadCategories();
    } catch (err) {
      console.error("Error reordering categories:", err);
      setError("Ошибка изменения порядка категорий");
      setCategories(originalCategories);
      throw err;
    } finally {
      setIsReordering(false);
    }
  };

  useEffect(() => {
    setCategoryTree(buildCategoryTree(categories, null));
  }, [categories]);

  const orderedCategories = useMemo(
    () => getCategoriesForSelect(categories),
    [categories]
  );

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    orderedCategories,
    loading,
    error,
    refreshCategories: loadCategories,
    createCategory,
    deleteCategory,
    getChildCategories,
    categoryTree,
    updateCategory,
    reorderCategories,
    isReordering,
  };
};
