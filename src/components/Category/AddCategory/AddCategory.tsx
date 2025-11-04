import { useState, type ChangeEvent, type FC, type FormEvent } from 'react';
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
  const { createCategory, loading, error, orderedCategories } = useCategories();
  const [categoryName, setCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedParentId(e.target.value);
  }

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert('Введите название категории');
      return;
    }

    try {
      setIsSubmitting(true);
      await createCategory({ name: categoryName.trim(), parentId: selectedParentId, userId: user?.uid || 'anonimus' });

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
            onChange={onChangeInput}
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
            onChange={onChangeSelect}
            categories={orderedCategories}
            emptyText="Корневая категория"
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