import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { AddCategoryForm } from "./AddCategory";
import { CategoryTree } from "./CategoryTree";


export const CategoriesList: React.FC = () => {
  const { categories, loading } = useCategories();
  const [activeTab, setActiveTab] = useState<'tree' | 'list'>('tree');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <h2 className="categories-title">Управление категориями</h2>

      <AddCategoryForm />

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('tree')}
          >
            Древовидный вид
          </button>
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Простой список
          </button>
        </div>
      </div>

      {activeTab === 'tree' ? (
        <CategoryTree onAddSubcategory={(parentId) => {
          console.log('Add subcategory for:', parentId);
        }} />
      ) : (
        <div className="card">
          <h3 className="card-title">Простой список всех категорий</h3>

          {categories.length === 0 ? (
            <div className="empty-state">
              Категорий пока нет
            </div>
          ) : (
            <div className="simple-list">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="simple-item"
                  style={{ marginLeft: `${category.depth * 20}px` }}
                >
                  <div className="item-info">
                    <span className="item-name">{category.name}</span>
                    <div className="item-details">
                      ID: {category.id} | Уровень: {category.depth} |
                      Родитель: {category.parentId || 'корневая'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};