import { type FC } from "react";
import { Spinner } from "@/components/Spinner";
import { SortableItem } from "./SortableItem";
import { DnDWrapper } from "@/components/DnDWrapper";
import type { ISortableListProps } from "./types";
import styles from "./styles.module.css";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";

export const SortableList: FC<ISortableListProps> = ({
  onClickEdit,
  categories,
  handleDragEnd,
  isLoading,
  onDelete,
  error,
}) => {
  if (error) {
    return <ErrorMessage title={error} />;
  }

  if (categories.length === 0) {
    return <div className={styles.emptyList}>Категорий пока нет</div>;
  }

  return (
    <div className={styles.SortableCategoryList}>
      <h3 className={styles.title}>
        Древовидная структура категорий
        <span className={styles.hint}>(перетаскивайте для изменения порядка)</span>
      </h3>

      <DnDWrapper items={categories} onDragEnd={handleDragEnd}>
        <div className={`${styles.treeContainer} ${isLoading ? styles.loading : ""}`}>
          {isLoading && (
            <div className={styles.loaderWrapper}>
              <Spinner />
            </div>
          )}
          {categories.map(category => (
            <SortableItem
              key={category.id}
              category={category}
              level={0}
              onDelete={onDelete}
              onClickEdit={onClickEdit}
              handleDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </DnDWrapper>
    </div>
  );
};
