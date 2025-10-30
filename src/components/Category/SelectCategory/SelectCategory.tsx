import type { ICategory } from "@/types";
import type { FC } from "react";
import styles from "./SelectCategory.module.css";

interface ISelectCategoryProps {
  value: string | null;
  onChange: (id: string) => void;
  categories: ICategory[];
  rootTextSelect?: string;
  classSelect?: string;
}

export const SelectCategory: FC<ISelectCategoryProps> = ({ value, categories, onChange, rootTextSelect = 'Пусто', classSelect }) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || '')}
      className={`${styles.select} ${classSelect || ''}`}
      disabled={categories.length === 0}
    >
      <option value="">{rootTextSelect}</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {'- '.repeat(category.depth)} {category.name}
        </option>
      ))}
    </select>
  );
};