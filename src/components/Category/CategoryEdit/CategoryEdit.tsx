import { type FC } from "react";
import { useCategories } from "@hooks/useCategories";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { PAGES } from "@/contants";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";

export const CategoryEdit: FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { updateCategory, categories, loading, error, orderedCategories } = useCategories();
  const navigate = useNavigate();
  const selectedCategory = categories.find(cat => cat.id === categoryId || "");

  const onUpdateCategory = async (name: string, parentId: string | null) => {
    if (!selectedCategory) {
      return;
    }

    const clearName = name.trim();

    if (!clearName) {
      return;
    }

    try {
      await updateCategory({
        categoryId: selectedCategory.id,
        name: clearName,
        newParentId: parentId || null,
      });
      navigate(PAGES.CATEGORIES.path);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      throw new Error(`Error creating category: ${errorMessage}`);
    }
  };

  if (!selectedCategory) {
    return <ErrorMessage title='Категория не найдена или не существует' />;
  }

  return (
    <CategoryForm
      selectedCategory={selectedCategory}
      onSubmitForm={onUpdateCategory}
      categories={orderedCategories}
      isLoading={loading}
      error={error}
      sumbitButtonText='Редактировать категорию'
      submittingButtonText='Сохранение...'
    />
  );
};
