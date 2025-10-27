import { type FC } from 'react';
import { type DragEndEvent } from '@dnd-kit/core';
import { useCategories } from '@hooks/useCategories';
import './styles.css';
import type { ICategory } from "@/types";
import { Spinner } from "@/components/Spinner";
import styles from "./styles.module.css";
import { SortableItem } from "./SortableItem";
import { DnDWrapper } from "@/components/DnDWrapper";
import { onDragEnd } from "./utils";

interface ISortableListProps {
  changeEdit: (category: ICategory) => void;
}

export const SortableList: FC<ISortableListProps> = ({ changeEdit }) => {
  const { categoryTree, deleteCategory, reorderCategories, loading, error } = useCategories();

  const handleDragEnd = async (event: DragEndEvent) => {
    onDragEnd(event, categoryTree, reorderCategories);
  };


  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (categoryTree.length === 0) {
    return (
      <div className="empty-state">
        Категорий пока нет
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="card-title">
        Древовидная структура категорий
        <span className="sortable-hint">(перетаскивайте для изменения порядка)</span>
      </h3>

      <DnDWrapper items={categoryTree} onDragEnd={handleDragEnd}>
        <div className="tree-container">
          {categoryTree.map(category => (
            <SortableItem
              key={category.id}
              category={category}
              level={0}
              onDelete={deleteCategory}
              onEdit={changeEdit}
            />
          ))}
        </div>
      </DnDWrapper>
    </div>
  );
};