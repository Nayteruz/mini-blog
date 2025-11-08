import type { FC } from "react";
import { CategoriesList } from "@components/Category";
import styles from "./Categories.module.css";
import { Heading } from "@/components/Heading";

export const CategoriesPage: FC = () => {
  return (
    <div className={styles.CategoriesPage}>
      <Heading as='h1'>Список категорий</Heading>
      <CategoriesList />
    </div>
  );
};
