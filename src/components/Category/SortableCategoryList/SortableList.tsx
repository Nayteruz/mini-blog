import { type FC } from 'react';
import { useCategories } from '@hooks/useCategories';
import { Spinner } from "@/components/Spinner";
import { SortableItem } from "./SortableItem";
import { DnDWrapper } from "@/components/DnDWrapper";
import styles from "./styles.module.css";
import type { ISortableListProps } from "./types";

export const SortableList: FC<ISortableListProps> = ({ changeEdit, categories, handleDragEnd, isLoading }) => {
  const { deleteCategory, error } = useCategories();

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={styles.emptyList}>
        Категорий пока нет
      </div>
    );
  }

  return (
    <div className={styles.SortableCategoryList}>
      <h3 className={styles.title}>
        Древовидная структура категорий
        <span className={styles.hint}>(перетаскивайте для изменения порядка)</span>
      </h3>

      <DnDWrapper items={categories} onDragEnd={handleDragEnd}>
        <div className={`${styles.treeContainer} ${isLoading ? styles.loading : ''}`}>
          {isLoading && <div className={styles.loaderWrapper}>
            <Spinner />
          </div>}
          {categories.map(category => (
            <SortableItem
              key={category.id}
              category={category}
              level={0}
              onDelete={deleteCategory}
              onEdit={changeEdit}
              handleDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </DnDWrapper>
    </div>
  );
};