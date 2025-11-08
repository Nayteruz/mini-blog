import { type FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/Button";
import { auth } from "@/configDb";
import EditIcon from "@assets/icons/penToSquare.svg?react";
import ArrowMove from "@assets/icons/arrowUpDown.svg?react";
import DeleteIcon from "@assets/icons/deleteIcon.svg?react";
import type { ISimpleCategoryListProps, ISimpleItemProps, ISimpleItemsProps } from "./types";
import { DnDWrapper } from "@/components/DnDWrapper";
import { Spinner } from "@/components/Spinner";
import styles from "./SimpleCategoryList.module.css";

const SimpleItem: FC<ISimpleItemProps> = ({ category, onClickEdit, level, handleDragEnd, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isAuthor = auth.currentUser?.uid === category.createdBy;

  const handleDelete = () => {
    if (window.confirm(`Удалить категорию "${category.name}"?`)) {
      onDelete(category.id);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`${styles.simpleItemRef} ${isDragging ? styles.dragging : ""}`}>
      <div style={{ marginLeft: `${level * 15}px` }} className={`${styles.simpleItem}`}>
        <div className={styles.info}>
          <button {...attributes} {...listeners} className={styles.dragHandle} title='Перетащите для изменения порядка'>
            <ArrowMove className={styles.dragHandleIcon} />
          </button>
          <span className={styles.name}>{category.name}</span>
        </div>
        {isAuthor && (
          <div className={styles.buttons}>
            <Button className={styles.button} variant='primary' size='small' onClick={() => onClickEdit(category.id)}>
              <EditIcon className={styles.icon} />
            </Button>
            <Button className={styles.button} variant='danger' size='small' onClick={handleDelete}>
              <DeleteIcon className={styles.icon} />
            </Button>
          </div>
        )}
      </div>
      {category?.children && category?.children?.length > 0 && (
        <SimpleItems
          categories={category.children}
          onClickEdit={onClickEdit}
          level={level + 1}
          handleDragEnd={handleDragEnd}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

const SimpleItems: FC<ISimpleItemsProps> = ({ categories, onClickEdit, level, handleDragEnd, onDelete }) => {
  return (
    <DnDWrapper items={categories} onDragEnd={handleDragEnd}>
      <div className={styles.list}>
        {categories.map(category => (
          <SimpleItem
            key={category.id}
            category={category}
            onClickEdit={onClickEdit}
            level={level}
            handleDragEnd={handleDragEnd}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DnDWrapper>
  );
};

export const SimpleCategoryList: FC<ISimpleCategoryListProps> = ({
  onClickEdit,
  categories,
  isLoading,
  handleDragEnd,
  onDelete,
}) => {
  if (categories.length === 0) {
    return (
      <div className={styles.SimpleCategoryList}>
        <h3 className={styles.title}>Простой список всех категорий</h3>
        <div className={styles.emptyList}>Категорий пока нет</div>
      </div>
    );
  }

  return (
    <div className={styles.SimpleCategoryList}>
      <h3 className={styles.title}>Простой список всех категорий</h3>
      <DnDWrapper items={categories} onDragEnd={handleDragEnd}>
        <div className={`${styles.list} ${isLoading ? styles.loading : ""}`}>
          {isLoading && (
            <div className={styles.loaderWrapper}>
              <Spinner />
            </div>
          )}
          {categories.map(category => (
            <SimpleItem
              key={category.id}
              category={category}
              onClickEdit={onClickEdit}
              level={0}
              handleDragEnd={handleDragEnd}
              onDelete={onDelete}
            />
          ))}
        </div>
      </DnDWrapper>
    </div>
  );
};
