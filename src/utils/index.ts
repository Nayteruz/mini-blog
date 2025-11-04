import type { ICategory } from "@/types";

export const getOwnCategories = (
  categories: ICategory[],
  categoryIds: string[] = []
) => {
  return categories.filter(cat => categoryIds.includes(cat.id));
};
