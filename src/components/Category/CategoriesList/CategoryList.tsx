import { useState, type FC } from 'react';
import { useCategories } from '@hooks/useCategories';
import { AddCategoryForm, EditCategoryForm } from "..";
import { SortableList } from "../SortableCategoryList/SortableList";
import type { ICategory } from "@/types";
import { Spinner } from "@/components/Spinner";
import { Tabs } from "@/components/Tabs";
import { SimpleCategoryList } from "../SimpleCategoryList/SimpleCategoryList";
import styles from "./CategoriesList.module.css";


export const CategoriesList: FC = () => {
  const { categoryTree, loading } = useCategories();
  const [activeTab, setActiveTab] = useState<string>('tree');
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  const views = [
    { key: 'tree', name: 'Древовидный вид', content: <SortableList changeEdit={setEditingCategory} /> },
    { key: 'list', name: 'Простой список', content: <SimpleCategoryList categories={categoryTree} changeEdit={setEditingCategory} /> }
  ]

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Spinner />
      </div>
    );
  }

  // Если редактируем категорию, показываем форму редактирования
  if (editingCategory) {
    return (
      <EditCategoryForm
        category={editingCategory}
        onCancel={() => setEditingCategory(null)}
        onSuccess={() => setEditingCategory(null)}
      />
    );
  }

  return (
    <>
      <h2 className="categories-title">Управление категориями</h2>
      <AddCategoryForm title="Добавить новую категорию" />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} list={views} />
    </>
  );
};