import type { ICategory } from "@/types";
import type { FC } from "react";
import styles from "./SelectCategory.module.css";

interface ISelectCategoryProps {
  value: string | null;
  onChange: (id: string) => void;
  categories: ICategory[];
  note?: string;
  label?: string;
  rootTextSelect?: string;
  classWrapper?: string;
  classLabel?: string;
  classSelect?: string;
  classNote?: string;
}

export const SelectCategory: FC<ISelectCategoryProps> = ({ label, value, categories, onChange, rootTextSelect = 'Пусто', note, classWrapper, classLabel, classSelect, classNote }) => {

  const classes = {
    wrapper: `${styles.wrapper} ${classWrapper || ''}`,
    label: `${styles.label} ${classLabel || ''}`,
    select: `${styles.select} ${classSelect || ''}`,
    note: `${styles.note} ${classNote || ''}`
  };

  return (
    <div className={classes.wrapper}>
      {label && <label htmlFor="parentCategory" className={classes.label}>
        {label}
      </label>}
      <select
        id="parentCategory"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || '')}
        className={classes.select}
        disabled={categories.length === 0}
      >
        <option value="">{rootTextSelect}</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {'- '.repeat(category.depth)} {category.name}
          </option>
        ))}
      </select>
      {note && <p className={classes.note}>
        {note}
      </p>}
    </div>
  );
};