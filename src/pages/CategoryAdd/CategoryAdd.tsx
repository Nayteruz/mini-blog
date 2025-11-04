import type { FC } from "react";
import { Heading } from "@/components/Heading";
import { AddCategoryForm } from "@components/Category";
import styles from "./CategoryAdd.module.css";
import { useCategories } from "@/hooks/useCategories";
import { useStore } from "@/store";

export const CategoryAddPage: FC = () => {
  const { createCategory, loading, error, orderedCategories } = useCategories();
  const { user } = useStore();

  return (
    <div className={styles.CategoryAddPage}>
      <Heading as="h1">Добавить категорию</Heading>
      <AddCategoryForm orderedCategories={orderedCategories} createCategory={createCategory} user={user} loading={loading} error={error} />
    </div>
  );
};