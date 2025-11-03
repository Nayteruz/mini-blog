import type { FC } from "react"
import type { ICategory } from "@/types"
import { Button } from "@/components/Button";
import styles from "./OwnCategories.module.css"

interface OwnCategoriesProps {
  categories: ICategory[];
  label?: string;
}

export const OwnCategories: FC<OwnCategoriesProps> = ({ categories = [], label = '' }) => {
  return (
    <div className={styles.OwnCategories}>
      <label>{label}</label>
      <ul className={styles.list}>
        {categories.map((cat) => <li key={cat.id}><Button size="small">{cat.name}</Button></li>)}
      </ul>
      {categories.length === 0 && <p>Нет категорий</p>}
    </div>
  )
}