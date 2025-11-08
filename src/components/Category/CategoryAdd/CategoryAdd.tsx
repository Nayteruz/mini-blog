import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { PAGES } from "@/contants";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { useCategories } from "@/hooks/useCategories";

export const CategoryAdd: FC = () => {
  const { createCategory, loading, error, orderedCategories } = useCategories();
  const navigate = useNavigate();

  const createCategoryForm = async (name: string, parentId: string | null, userId?: string) => {
    const clearName = name.trim();

    if (!clearName) {
      return;
    }

    try {
      await createCategory({ name: clearName, parentId, userId: userId || "" });
      navigate(PAGES.CATEGORIES.path);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      throw new Error(`Error creating category: ${errorMessage}`);
    }
  };

  return (
    <CategoryForm
      onSubmitForm={createCategoryForm}
      categories={orderedCategories}
      isLoading={loading}
      error={error}
      sumbitButtonText='Создать категорию'
      submittingButtonText='Сохранение...'
    />
  );
};
