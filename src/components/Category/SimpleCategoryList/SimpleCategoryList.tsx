import { type FC } from "react";
import { Button } from "@/components/Button";
import EditIcon from '@assets/icons/penToSquare.svg?react';
import type { ISimpleCategoryListProps, ISimpleItemProps, ISimpleItemsProps } from "./types";
import { DnDWrapper } from "@/components/DnDWrapper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Spinner } from "@/components/Spinner";
import styles from "./SimpleCategoryList.module.css";


const SimpleItem: FC<ISimpleItemProps> = ({ category, changeEdit, level, handleDragEnd }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${styles.simpleItemRef} ${isDragging ? styles.dragging : ''}`}>
      <div style={{ marginLeft: `${level * 15}px` }} className={`${styles.simpleItem}`}>
        <div className={styles.info}>
          <button {...attributes} {...listeners} className={styles.dragHandle} title="Перетащите для изменения порядка">⋮⋮</button>
          <span className={styles.name}>{category.name}</span>
        </div>
        <div className={styles.buttons}>
          <Button className={styles.button} variant="primary" onClick={() => changeEdit(category)}><EditIcon className={styles.icon} /></Button>
        </div>
      </div>
      {category?.children && category?.children?.length > 0 && <SimpleItems categories={category.children} changeEdit={changeEdit} level={level + 1} handleDragEnd={handleDragEnd} />}
    </div>
  )
}

const SimpleItems: FC<ISimpleItemsProps> = ({ categories, changeEdit, level, handleDragEnd }) => {
  return (
    <DnDWrapper items={categories} onDragEnd={handleDragEnd}>
      <div className={styles.list}>
        {categories.map(category => (
          <SimpleItem key={category.id} category={category} changeEdit={changeEdit} level={level} handleDragEnd={handleDragEnd} />
        ))}
      </div>
    </DnDWrapper>
  )
}


export const SimpleCategoryList: FC<ISimpleCategoryListProps> = ({ changeEdit, categories, isLoading, handleDragEnd }) => {
  if (categories.length === 0) {
    return (
      <div className={styles.SimpleCategoryList}>
        <h3 className={styles.title}>Простой список всех категорий</h3>
        <div className={styles.emptyList}>
          Категорий пока нет
        </div>
      </div>
    );
  }

  return (
    <div className={styles.SimpleCategoryList}>
      <h3 className={styles.title}>Простой список всех категорий</h3>
      <DnDWrapper items={categories} onDragEnd={handleDragEnd}>
        <div className={`${styles.list} ${isLoading ? styles.loading : ''}`}>
          {isLoading && (
            <div className={styles.loaderWrapper}>
              <Spinner />
            </div>
          )}
          {categories.map(category => (
            <SimpleItem key={category.id} category={category} changeEdit={changeEdit} level={0} handleDragEnd={handleDragEnd} />
          ))}
        </div>
      </DnDWrapper>
    </div >
  );
};