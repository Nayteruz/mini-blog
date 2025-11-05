import { useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { SelectCategory } from "../SelectCategory/SelectCategory";
import { Button } from "@/components/Button";
import styles from "./AddCategory.module.css";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import type { ICategory } from "@/types";
import { Heading } from "@/components/Heading";
import type { ICreateCategoryHookArguments } from "@/hooks/types";
import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { PAGES } from "@/contants";

interface IAddCategoryProps {
  orderedCategories: ICategory[];
  createCategory: (params: ICreateCategoryHookArguments) => Promise<string>
  error: string | null;
  loading: boolean;
  user: User | null;
}

export const AddCategoryForm: FC<IAddCategoryProps> = ({ orderedCategories, createCategory, error, loading, user }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

      setCategoryName('');
      setSelectedParentId(null);
      navigate(PAGES.CATEGORIES.path);
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.AddCategoryForm}>
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
      {error && <Heading as="h4" error>{error}</Heading>}
      <Button className="form-button" type="submit" disabled={!categoryName.trim() || isSubmitting || loading}>
        {isSubmitting ? 'Создание...' : 'Создать категорию'}
      </Button>
    </form>
  );
};