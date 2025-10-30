import type { FC } from "react";
import { CategoriesList } from "@components/Category";
import styles from "./Categories.module.css";

export const CategoriesPage: FC = () => {
  return (
    <div className={styles.CategoriesPage}>
      <h1>Страница категории</h1>
      <CategoriesList />
    </div>
  );
};