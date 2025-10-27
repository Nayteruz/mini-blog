import { useState, type FC } from "react";
import { CSS } from '@dnd-kit/utilities';
import type { ISortableItemProps } from "./types";
import { useSortable } from "@dnd-kit/sortable";

export const SortableItem: FC<ISortableItemProps> = ({ category, level, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

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
      className={`tree-node ${isDragging ? 'dragging' : ''}`}
    >
      <div className="tree-item">
        <div className="tree-item-content">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="drag-handle"
            title="Перетащите для изменения порядка"
          >
            ⋮⋮
          </button>

          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="tree-toggle"
            >
              {isExpanded ? '▼' : '►'}
            </button>
          )}
          {!hasChildren && <div className="tree-spacer"></div>}

          <span className="tree-name">{category.name}</span>
        </div>

        <div className="tree-meta">
          <span className="tree-order">порядок: {category.order + 1}</span>
          <span className="tree-level">уровень: {level}</span>
          <button
            onClick={handleEdit}
            className="edit-button"
          >
            Редактировать
          </button>
          <button
            onClick={handleDelete}
            className="delete-button"
          >
            Удалить
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-children">
          {category.children!.map(child => (
            <SortableItem
              key={child.id}
              category={child}
              level={level + 1}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};