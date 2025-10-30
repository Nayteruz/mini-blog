import { useState, type FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import type { ISortableItemProps } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import styles from "./styles.module.css";
import { ArrowToggle } from "@/components/ArrowToggle";
import { Button } from "@/components/Button";
import EditIcon from "@assets/icons/penToSquare.svg?react";
import DeleteIcon from "@assets/icons/deleteIcon.svg?react";
import ArrowMove from "@assets/icons/arrowUpDown.svg?react";
import { DnDWrapper } from "@/components/DnDWrapper";

const sizes: Record<number, number> = {
  0: 18,
  1: 16,
  2: 14,
  3: 12,
  4: 10,
  5: 10,
  6: 10,
  7: 10,
};

export const SortableItem: FC<ISortableItemProps> = ({
  category,
  level,
  onDelete,
  onEdit,
  handleDragEnd,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const handleDelete = () => {
    if (window.confirm(`Удалить категорию "${category.name}"?`)) {
      onDelete(category.id);
    }
  };

  const handleEdit = () => {
    onEdit(category);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.treeNode} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.item}>
        <div className={styles.content}>
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className={styles.dragHandle}
            title="Перетащите для изменения порядка"
          >
            <ArrowMove className={styles.dragHandleIcon} />
          </button>
          {hasChildren && (
            <ArrowToggle
              className={styles.arrow}
              isOpen={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
          {!hasChildren && <div className={styles.spacer}></div>}
          <span className={styles.name} style={{ fontSize: sizes[level] }}>
            {category.name}
          </span>
        </div>

        <div className={styles.details}>
          <Button
            className={styles.button}
            variant="primary"
            onClick={handleEdit}
          >
            <EditIcon className={styles.icon} />
          </Button>
          <Button
            className={styles.button}
            variant="secondary"
            onClick={handleDelete}
          >
            <DeleteIcon className={styles.icon} />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.subList}>
          <DnDWrapper items={category.children!} onDragEnd={handleDragEnd}>
            <div className={styles.subList}>
              {category.children!.map((category) => (
                <SortableItem
                  key={category.id}
                  category={category}
                  level={level + 1}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  handleDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </DnDWrapper>
        </div>
      )}
    </div>
  );
};
