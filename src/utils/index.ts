import type { ICategory } from "@/types";

export const getOwnCategories = (categories: ICategory[], categoryIds: string[] = []) => {
  return categories.filter(cat => categoryIds.includes(cat.id));
};

export const getSelectedPath = (categories: ICategory[], id: string, path: string[] = []): string[] => {
  const outerPath: string[] = path || [];

  if (id) {
    const category = categories.find(cat => cat.id === id);

    if (category) {
      outerPath.push(category.id);
      return getSelectedPath(categories, category.parentId || "", outerPath);
    }
  }

  return outerPath;
};
