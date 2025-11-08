import type { FC } from "react";
import { Heading } from "@/components/Heading";
import { CategoryAdd } from "@components/Category";
import styles from "./CategoryAdd.module.css";

export const CategoryAddPage: FC = () => {
  return (
    <div className={styles.CategoryAddPage}>
      <Heading as='h1'>Добавить категорию</Heading>
      <CategoryAdd />
    </div>
  );
};
