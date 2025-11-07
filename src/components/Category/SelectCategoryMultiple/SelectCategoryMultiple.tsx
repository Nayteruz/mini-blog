import React, { useState, useMemo, type FC, type ChangeEvent } from "react";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { getOwnCategories } from "@/utils";
import styles from "./SelectCategoryMultiple.module.css";
import { Input } from "@/components/Input";
import type { ICategory } from "@/types";

interface IMultiCategorySelectProps {
  value: string[];
  onChange: (categoryIds: string[]) => void;
  categories: ICategory[];
  orderedCategories: ICategory[];
  maxCategories?: number;
}

interface ICategoryItemProps {
  category: ICategory;
  selectedCategoryIds: string[];
  handleCategoryToggle: (categoryId: string) => void;
}

const CategoryOption: FC<ICategoryItemProps> = ({
  category,
  selectedCategoryIds,
  handleCategoryToggle,
}) => {
  return (
    <label key={category.id} className={styles.CategoryOption}>
      <input
        type='checkbox'
        checked={selectedCategoryIds.includes(category.id)}
        onChange={() => handleCategoryToggle(category.id)}
      />
      <span className={styles.optionText}>
        {"→ ".repeat(category.depth)} {category.name}
      </span>
    </label>
  );
};

export const SelectCategoryMultiple: React.FC<IMultiCategorySelectProps> = ({
  value: selectedCategoryIds,
  onChange,
  maxCategories = 5,
  categories = [],
  orderedCategories = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return orderedCategories;

    const term = searchTerm.toLowerCase();
    return orderedCategories.filter(category =>
      category.name.toLowerCase().includes(term)
    );
  }, [orderedCategories, searchTerm]);

  const selectedCategories = useMemo(
    () => getOwnCategories(categories, selectedCategoryIds),
    [categories, selectedCategoryIds]
  );

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryToggle = (categoryId: string) => {
    let newSelectedIds: string[];

    if (selectedCategoryIds.includes(categoryId)) {
      newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId);
    } else {
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
        {selectedCategories.map(category => (
          <Button
            size='small'
            variant='secondary'
            onClick={() => removeCategory(category.id)}
          >
            {category.name} ×
          </Button>
        ))}
        {selectedCategoryIds.length === 0 && (
          <Heading as='p' disabled>
            Категории не выбраны
          </Heading>
        )}
        <span className={styles.categoryCount}>
          {selectedCategoryIds.length}/{maxCategories}
        </span>
      </div>
      <Button
        className={styles.buttonToggle}
        onClick={() => setIsOpen(!isOpen)}
        disabled={selectedCategoryIds.length >= maxCategories}
      >
        {isOpen ? "Скрыть категории" : "Выбрать категории"}
      </Button>

      {isOpen && (
        <div className={styles.CategoriesDropdown}>
          <div className={styles.search}>
            <Input
              value={searchTerm}
              onChange={onChangeSearch}
              placeholder='Поиск категорий...'
              className={styles.searchInput}
            />
          </div>
          <div className={styles.categories}>
            {filteredCategories.length === 0 && (
              <Heading as='p' disabled className={styles.notFound}>
                Категории не найдены
              </Heading>
            )}
            {filteredCategories.length > 0 &&
              filteredCategories.map(category => (
                <CategoryOption
                  key={category.id}
                  category={category}
                  selectedCategoryIds={selectedCategoryIds}
                  handleCategoryToggle={handleCategoryToggle}
                />
              ))}
          </div>
          <div className={styles.actions}>
            <Button
              type='button'
              variant='danger'
              size='small'
              onClick={clearAll}
            >
              Очистить все
            </Button>
            <Button
              type='button'
              variant='success'
              size='small'
              disabled={selectedCategoryIds.length === 0}
              onClick={() => setIsOpen(false)}
            >
              Готово
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
