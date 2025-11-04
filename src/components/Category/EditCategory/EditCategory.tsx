import { useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { useCategories } from '@hooks/useCategories';
import type { ICategory } from "@/types";
import { SelectCategory } from "../SelectCategory/SelectCategory";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow/ListRow";
import './categories.css';

interface IEditCategoryProps {
  category: ICategory;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditCategoryForm: FC<IEditCategoryProps> = ({
  category,
  onCancel,
  onSuccess
}) => {
  const { updateCategory, categories, loading, error } = useCategories();
  const [categoryName, setCategoryName] = useState(category.name);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(category.parentId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем упорядоченный список категорий для выбора родителя
  const orderedCategories = categories.filter(cat => cat.id !== category.id); // Исключаем текущую категорию

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  }

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedParentId(e.target.value);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert('Введите название категории');
      return;
    }

    // Проверяем, что не выбираем дочернюю категорию в качестве родителя
    if (selectedParentId) {
      const selectedParent = categories.find(cat => cat.id === selectedParentId);
      if (selectedParent && selectedParent.path.includes(category.id)) {
        alert('Нельзя выбрать дочернюю категорию в качестве родителя');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await updateCategory(category.id, categoryName.trim(), selectedParentId);
      onSuccess();
      alert('Категория успешно обновлена!');
    } catch (err) {
      console.error('Error updating category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Получаем текущее название родительской категории для отображения
  const getCurrentParentName = () => {
    if (!category.parentId) return 'Корневая категория';
    const parent = categories.find(cat => cat.id === category.parentId);
    return parent ? parent.name : 'Неизвестная категория';
  };

  return (
    <div className="edit-category-form">
      <h3 className="edit-category-title">Редактировать категорию</h3>

      <div className="current-category-info">
        <div className="info-item">
          <strong>Текущее название:</strong> {category.name}
        </div>
        <div className="info-item">
          <strong>Текущий родитель:</strong> {getCurrentParentName()}
        </div>
        <div className="info-item">
          <strong>Уровень вложенности:</strong> {category.depth}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-fields">
        <ListRow
          label="Новое название категории"
          required
        >
          <Input
            value={categoryName}
            onChange={onChangeInput}
            placeholder="Новое название категории..."
            required
          />
        </ListRow>
        <ListRow
          label="Новый родитель (необязательно)"
          note="Если не выбрать, категория станет корневой"
          required
        >
          <SelectCategory
            emptyText="Корневая категория"
            value={selectedParentId || ''}
            categories={orderedCategories}
            onChange={onChangeSelect}
          />
        </ListRow>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="secondary-button"
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!categoryName.trim() || isSubmitting || loading}
            className="form-button"
          >
            {isSubmitting ? 'Обновление...' : 'Обновить категорию'}
          </button>
        </div>
      </form>
    </div>
  );
};