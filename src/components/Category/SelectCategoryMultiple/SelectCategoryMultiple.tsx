import React, { useState, useMemo, type FC } from 'react';
import { useCategories } from '@hooks/useCategories';
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import styles from "./SelectCategoryMultiple.module.css";
import { Input } from "@/components/Input";
import type { ICategory } from "@/types";


interface MultiCategorySelectProps {
  value: string[];
  onChange: (categoryIds: string[]) => void;
  maxCategories?: number;
}

interface ICategoryItemProps {
  category: ICategory;
  selectedCategoryIds: string[];
  handleCategoryToggle: (categoryId: string) => void;
}

const CategoryOption: FC<ICategoryItemProps> = ({ category, selectedCategoryIds, handleCategoryToggle }) => {
  return (
    <label key={category.id} className={styles.CategoryOption}>
      <input
        type="checkbox"
        checked={selectedCategoryIds.includes(category.id)}
        onChange={() => handleCategoryToggle(category.id)}
      />
      <span className={styles.optionText}>
        {'→ '.repeat(category.depth)} {category.name}
      </span>
    </label>
  );
}

export const SelectCategoryMultiple: React.FC<MultiCategorySelectProps> = ({
  value: selectedCategoryIds,
  onChange,
  maxCategories = 5
}) => {
  const { categories, getCategoriesForSelect } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Получаем упорядоченные категории
  const orderedCategories = useMemo(() => {
    return getCategoriesForSelect();
  }, [categories, getCategoriesForSelect]);

  // Фильтруем категории по поиску
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return orderedCategories;

    const term = searchTerm.toLowerCase();
    return orderedCategories.filter(category =>
      category.name.toLowerCase().includes(term)
    );
  }, [orderedCategories, searchTerm]);

  // Получаем выбранные категории для отображения
  const selectedCategories = useMemo(() => {
    return categories.filter(cat => selectedCategoryIds.includes(cat.id));
  }, [categories, selectedCategoryIds]);

  const handleCategoryToggle = (categoryId: string) => {
    let newSelectedIds: string[];

    if (selectedCategoryIds.includes(categoryId)) {
      // Убираем категорию
      newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId);
    } else {
      // Добавляем категорию (проверяем лимит)
      if (selectedCategoryIds.length >= maxCategories) {
        alert(`Можно выбрать не более ${maxCategories} категорий`);
        return;
      }
      newSelectedIds = [...selectedCategoryIds, categoryId];
    }

    onChange(newSelectedIds);
  };

  const removeCategory = (categoryId: string) => {
    const newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId);
    onChange(newSelectedIds);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={styles.SelectCategoryMultiple}>
      <div className={styles.selectedCategories}>
        {selectedCategories.map(category => <Button size="small" variant="secondary" onClick={() => removeCategory(category.id)}>{category.name} ×</Button>)}
        {selectedCategoryIds.length === 0 && (
          <Heading as="p" disabled>Категории не выбраны</Heading>
        )}
        <span className={styles.categoryCount}>{selectedCategoryIds.length}/{maxCategories}</span>
      </div>
      <Button className={styles.buttonToggle} onClick={() => setIsOpen(!isOpen)} disabled={selectedCategoryIds.length >= maxCategories}>
        {isOpen ? 'Скрыть категории' : 'Выбрать категории'}
      </Button>

      {isOpen && (
        <div className={styles.CategoriesDropdown}>
          <div className={styles.search}>
            <Input
              value={searchTerm}
              setValue={setSearchTerm}
              placeholder="Поиск категорий..."
              classInput={styles.searchInput}
            />
          </div>
          <div className={styles.categories}>
            {filteredCategories.length === 0 ? (
              <Heading as="p" disabled className={styles.notFound}>Категории не найдены</Heading>
            ) : (
              filteredCategories.map(category => (
                <CategoryOption
                  key={category.id}
                  category={category}
                  selectedCategoryIds={selectedCategoryIds}
                  handleCategoryToggle={handleCategoryToggle}
                />
              ))
            )}
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="danger" size="small" onClick={clearAll}>Очистить все</Button>
            <Button type="button" variant="success" size="small" disabled={selectedCategoryIds.length === 0} onClick={() => setIsOpen(false)}>Готово</Button>
          </div>
        </div>
      )}
    </div>
  );
};