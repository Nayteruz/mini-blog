import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCategories } from '@hooks/useCategories';
import './styles.css';
import type { ICategory } from "@/types";

// Sortable Item Component
interface SortableTreeNodeProps {
  category: ICategory & { children?: any[] };
  level: number;
  onDelete: (categoryId: string) => void;
  onEdit: (category: ICategory) => void;
}

const SortableTreeNode: React.FC<SortableTreeNodeProps> = ({
  category,
  level,
  onDelete,
  onEdit
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
            <SortableTreeNode
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

// Main Sortable Tree Component
interface SortableCategoryTreeProps {
  onEditCategory: (category: ICategory) => void;
}

export const SortableCategoryTree: React.FC<SortableCategoryTreeProps> = ({
  onEditCategory
}) => {
  const { categoryTree, deleteCategory, reorderCategories, loading, error } = useCategories();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Находим родительскую категорию для активного элемента
    const activeCategory = findCategoryById(categoryTree, active.id as string);
    const overCategory = findCategoryById(categoryTree, over.id as string);

    if (!activeCategory || !overCategory) {
      return;
    }

    // Проверяем, что категории имеют одного родителя
    if (activeCategory.parentId !== overCategory.parentId) {
      alert('Можно сортировать только категории одного уровня вложенности');
      return;
    }

    const parentId = activeCategory.parentId;
    const siblings = getSiblings(categoryTree, parentId);

    const oldIndex = siblings.findIndex(item => item.id === active.id);
    const newIndex = siblings.findIndex(item => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(siblings, oldIndex, newIndex);

      try {
        await reorderCategories(parentId, reordered);
      } catch (err) {
        console.error('Error reordering:', err);
      }
    }
  };

  // Вспомогательная функция для поиска категории по ID
  const findCategoryById = (tree: any[], id: string): ICategory | null => {
    for (const item of tree) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findCategoryById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Вспомогательная функция для получения соседних категорий
  const getSiblings = (tree: any[], parentId: string | null): ICategory[] => {
    if (parentId === null) {
      return tree;
    }

    const findSiblings = (nodes: any[]): ICategory[] => {
      for (const node of nodes) {
        if (node.id === parentId) {
          return node.children || [];
        }
        if (node.children) {
          const siblings = findSiblings(node.children);
          if (siblings.length > 0) return siblings;
        }
      }
      return [];
    };

    return findSiblings(tree);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка дерева категорий...</div>
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

  return (
    <div className="card">
      <h3 className="card-title">
        Древовидная структура категорий
        <span className="sortable-hint">(перетаскивайте для изменения порядка)</span>
      </h3>

      {categoryTree.length === 0 ? (
        <div className="empty-state">
          Категорий пока нет
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={categoryTree.map(item => item.id)} strategy={verticalListSortingStrategy}>
            <div className="tree-container">
              {categoryTree.map(category => (
                <SortableTreeNode
                  key={category.id}
                  category={category}
                  level={0}
                  onDelete={deleteCategory}
                  onEdit={onEditCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};