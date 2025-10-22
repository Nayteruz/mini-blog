import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import type { ICategory } from "../types";

interface TreeNodeProps {
  category: ICategory & { children?: any[] };
  level: number;
  onDelete: (categoryId: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ category, level, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const handleDelete = () => {
    if (window.confirm(`Удалить категорию "${category.name}"?`)) {
      onDelete(category.id);
    }
  };

  return (
    <div className="tree-node">
      <div className="tree-item">
        <div className="tree-item-content">
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
          <span className="tree-level">уровень {level}</span>
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
            <TreeNode
              key={child.id}
              category={child}
              level={level + 1}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryTreeProps {
  onAddSubcategory: (parentId: string) => void;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({ onAddSubcategory }) => {
  const { categoryTree, deleteCategory, loading, error } = useCategories();

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
      <h3 className="card-title">Древовидная структура категорий</h3>

      {categoryTree.length === 0 ? (
        <div className="empty-state">
          Категорий пока нет
        </div>
      ) : (
        <div className="tree-container">
          {categoryTree.map(category => (
            <TreeNode
              key={category.id}
              category={category}
              level={0}
              onDelete={deleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};