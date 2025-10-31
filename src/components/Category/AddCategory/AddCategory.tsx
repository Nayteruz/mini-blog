import { useState, type FC, type FormEvent } from 'react';
import { useCategories } from '@hooks/useCategories';
import { useStore } from "@store/index";
import { SelectCategory } from "../SelectCategory/SelectCategory";
import { Button } from "@/components/Button";
import styles from "./AddCategory.module.css";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow/ListRow";

interface IAddCategoryProps {
  title?: string
}

export const AddCategoryForm: FC<IAddCategoryProps> = ({ title }) => {
  const { user } = useStore();
  const { createCategory, loading, error, getCategoriesForSelect } = useCategories();
  const [categoryName, setCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedCategories = getCategoriesForSelect();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert('Введите название категории');
      return;
    }

    try {
      setIsSubmitting(true);
      await createCategory(categoryName.trim(), selectedParentId, user?.uid || 'anonimus');

      // Сброс формы после успешного создания
      setCategoryName('');
      setSelectedParentId(null);

      alert('Категория успешно создана!');
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title || 'Добавление категории'}</h3>

      <form onSubmit={handleSubmit} className="form-fields">
        <ListRow
          label="Название категории"
          required
        >
          <Input
            value={categoryName}
            setValue={setCategoryName}
            placeholder="Название категории..."
            required
          />
        </ListRow>
        <ListRow
          label="Родительская категория (необязательно)"
          note="Eсли не выбрать, категория будет создана в корне"
          required
        >
          <SelectCategory
            value={selectedParentId || ''}
            onChange={setSelectedParentId}
            categories={orderedCategories}
            rootTextSelect="Корневая категория"
          />
        </ListRow>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <Button className="form-button" type="submit" disabled={!categoryName.trim() || isSubmitting || loading}>
          {isSubmitting ? 'Создание...' : 'Создать категорию'}
        </Button>
      </form>
    </div>
  );
};