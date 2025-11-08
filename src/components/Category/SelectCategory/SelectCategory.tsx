import type { ChangeEvent } from "react";
import styles from "./SelectCategory.module.css";

interface BaseSelect {
  id: string;
  name: string;
  depth?: number;
}

interface ISelectCategoryProps<T> {
  value: string | null;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  categories: T[];
  disabledId?: string;
  emptyText?: string;
  emptyValue?: string;
  className?: string;
}

export const SelectCategory = <T extends BaseSelect>({
  value,
  categories,
  onChange,
  emptyText,
  className,
  emptyValue,
  disabledId,
}: ISelectCategoryProps<T>) => {
  return (
    <select
      value={value || ""}
      onChange={onChange}
      className={`${styles.select} ${className || ""}`}
      disabled={categories.length === 0}
    >
      {emptyText && <option value={emptyValue || ""}>{emptyText}</option>}
      {categories.map(category => (
        <option key={category.id} value={category.id} disabled={category.id === disabledId}>
          {"→ ".repeat(category?.depth || 0)} {category.name}
        </option>
      ))}
    </select>
  );
};
