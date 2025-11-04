import { useEffect, useState, type FC } from 'react';
import { useCategories } from '@hooks/useCategories';
import type { DragEndEvent } from "@dnd-kit/core";
import { EditCategoryForm } from "..";
import { SortableList } from "../SortableCategoryList/SortableList";
import { SimpleCategoryList } from "../SimpleCategoryList/SimpleCategoryList";
import type { ICategory } from "@/types";
import { Spinner } from "@/components/Spinner";
import { Tabs } from "@/components/Tabs";
import styles from "./CategoriesList.module.css";
import { onDragEnd } from "../SortableCategoryList/utils";
import { useNavigate } from "react-router-dom";
import { PAGES } from "@/contants";
import { Button } from "@/components/Button";


export const CategoriesList: FC = () => {
  const { categoryTree, loading, reorderCategories, deleteCategory, error } = useCategories();
  const [activeTab, setActiveTab] = useState<string>('tree');
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const navigate = useNavigate();

  const onAddCategory = () => {
    navigate(PAGES.CATEGORY_ADD.path);
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const newOrder = onDragEnd(event, categoryTree);
    try {
      await reorderCategories(newOrder || []);
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  useEffect(() => {
    if (!isFirstLoad) {
      setIsFirstLoad(true);
    }
  }, [loading]);

  const views = [
    { key: 'tree', name: 'Древовидный вид', content: <SortableList categories={categoryTree} isLoading={loading} handleDragEnd={handleDragEnd} changeEdit={setEditingCategory} onDelete={deleteCategory} error={error} /> },
    { key: 'list', name: 'Простой список', content: <SimpleCategoryList categories={categoryTree} isLoading={loading} handleDragEnd={handleDragEnd} changeEdit={setEditingCategory} onDelete={deleteCategory} /> }
  ]

  if (loading && !isFirstLoad) {
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
      <Button className={styles.buttonAdd} onClick={onAddCategory}>Добавить категорию <span>+</span></Button>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} list={views} />
    </>
  );
};