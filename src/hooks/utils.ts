import type { ICategory, ICategoryTree, ICreateCategoryData } from "@/types";
import type { ICreateCategoryDataParams, IUpdateCategoryDataParams, IUpdateCategoryDataResult } from "./types";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/configDb";
import { DB_KEYS } from "./const";

export const createCategoryData = (params: ICreateCategoryDataParams): ICreateCategoryData => {
  const { categories, name, parentId, userId } = params;
  let path: string[] = [];
  let depth = 0;

  if (parentId) {
    const parentCategory = categories.find(cat => cat.id === parentId);
    if (parentCategory) {
      path = [...parentCategory.path];
      depth = parentCategory.depth + 1;
    } else {
      throw new Error("Родительская категория не найдена");
    }
  }

  const siblings = categories.filter(cat => cat.parentId === parentId);
  const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(cat => cat.order)) : -1;
  const newOrder = maxOrder + 1;

  return {
    name,
    parentId: parentId || null,
    path,
    depth,
    order: newOrder,
    createdAt: new Date(),
    createdBy: userId,
  };
};

export const updateCategoryData = (params: IUpdateCategoryDataParams): IUpdateCategoryDataResult => {
  const { categories, categoryToUpdate, categoryId, name, newParentId } = params;

  let newPath: string[] = [];
  let newDepth = 0;

  // Если родитель изменился, пересчитываем путь и глубину
  if (newParentId !== categoryToUpdate.parentId) {
    if (newParentId) {
      const newParent = categories.find(cat => cat.id === newParentId);
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
  const newSiblings = categories.filter(cat => cat.parentId === newParentId && cat.id !== categoryId);
  const maxOrder = newSiblings.length > 0 ? Math.max(...newSiblings.map(cat => cat.order)) : -1;
  const newOrder = maxOrder + 1;

  // OPTIMISTIC UPDATE: сразу обновляем локальное состояние
  const updatedCategories = categories.map(cat =>
    cat.id === categoryId
      ? {
          ...cat,
          name,
          parentId: newParentId,
          path: newPath,
          depth: newDepth,
        }
      : cat
  );

  return {
    updatedCategories,
    newPath,
    updateData: {
      name,
      parentId: newParentId,
      path: newPath,
      depth: newDepth,
      order: newOrder,
      updatedAt: new Date(),
    },
  };
};

export const getChildCategories = (list: ICategory[], parentId: string | null): ICategory[] => {
  return list.filter(category => category.parentId === parentId).sort((a, b) => a.order - b.order);
};

export const getCategoriesForSelect = (categories: ICategory[]): ICategory[] => {
  const result: ICategory[] = [];

  const addCategories = (parentId: string | null, depth: number) => {
    const children = getChildCategories(categories, parentId);
    children.forEach(category => {
      result.push(category);
      addCategories(category.id, depth + 1);
    });
  };

  addCategories(null, 0);
  return result;
};

export const buildCategoryTree = (list: ICategory[], parentId: string | null = null): ICategoryTree[] => {
  const children = getChildCategories(list, parentId);
  return children.map(category => ({
    ...category,
    children: buildCategoryTree(list, category.id),
  }));
};

export const updateChildCategoriesPaths = async (categories: ICategory[], parentId: string, parentPath: string[]) => {
  const childCategories = categories.filter(cat => cat.parentId === parentId);

  for (const child of childCategories) {
    const newChildPath = [...parentPath, child.id];
    await updateDoc(doc(db, DB_KEYS.CATEGORIES, child.id), {
      path: newChildPath,
      depth: parentPath.length,
    });

    await updateChildCategoriesPaths(categories, child.id, newChildPath);
  }
};

export const getUpdatedCategories = (categories: ICategory[], reorderedCategories: ICategory[]) => {
  const newOrderMap = new Map();
  reorderedCategories.forEach((category, index) => {
    newOrderMap.set(category.id, index);
  });

  // 2. Обновляем локальное состояние
  return categories
    .map(category => {
      const newOrder = newOrderMap.get(category.id);
      if (newOrder !== undefined) {
        return {
          ...category,
          order: newOrder,
        };
      }
      return category;
    })
    .sort((a, b) => {
      // Сортируем сначала по родителю, потом по порядку
      if (a.parentId !== b.parentId) {
        return (a.parentId || "").localeCompare(b.parentId || "");
      }
      return a.order - b.order;
    });
};

// Утилиты для работы с Base64 изображениями

// Проверка размера Base64 строки
export const getBase64Size = (base64String: string): number => {
  // Убираем префикс "data:image/..."
  const base64 = base64String.split(",")[1];
  // Base64 занимает ~4/3 от исходного размера
  return (base64.length * 3) / 4;
};

// Оптимизация Base64 строки
export const optimizeBase64Image = (base64String: string, maxSizeKB = 500): string => {
  const sizeKB = getBase64Size(base64String) / 1024;

  if (sizeKB <= maxSizeKB) {
    return base64String;
  }

  console.warn(`Base64 изображение большое: ${Math.round(sizeKB)}KB`);
  return base64String; // В реальном приложении можно добавить сжатие
};

// Получение информации об изображении
export const getImageInfo = (base64String: string) => {
  return new Promise<{ width: number; height: number }>(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = base64String;
  });
};
