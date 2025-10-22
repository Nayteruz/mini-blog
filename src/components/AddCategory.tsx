import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';

export const AddCategoryForm: React.FC = () => {
  const { categories, createCategory, loading, error, getCategoriesForSelect } = useCategories();
  const [categoryName, setCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedCategories = getCategoriesForSelect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert('Введите название категории');
      return;
    }

    try {
      setIsSubmitting(true);
      await createCategory(categoryName.trim(), selectedParentId);

      // Сброс формы после успешного создания
      setCategoryName('');
      setSelectedParentId(null);

      alert('Категория успешно создана!');
    } catch (err) {
      // Ошибка уже обработана в хуке
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="category-form">
      <h3 className="category-form-title">Добавить новую категорию</h3>

      <form onSubmit={handleSubmit} className="form-fields">
        <div className="form-group">
          <label htmlFor="categoryName" className="form-label">
            Название категории *
          </label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Введите название категории"
            className="form-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="parentCategory" className="form-label">
            Родительская категория (необязательно)
          </label>
          <select
            id="parentCategory"
            value={selectedParentId || ''}
            onChange={(e) => setSelectedParentId(e.target.value || null)}
            className="form-select"
            disabled={isSubmitting || categories.length === 0}
          >
            <option value="">-- Корневая категория (без родителя) --</option>
            {orderedCategories.map(category => (
              <option key={category.id} value={category.id}>
                {'- '.repeat(category.depth)} {category.name}
              </option>
            ))}
          </select>
          <p className="form-help">
            Если не выбрать, категория будет создана в корне
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!categoryName.trim() || isSubmitting || loading}
          className="form-button"
        >
          {isSubmitting ? 'Создание...' : 'Создать категорию'}
        </button>
      </form>
    </div>
  );
};