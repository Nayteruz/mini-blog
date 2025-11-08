import type { FC } from "react";
import { CategoryEdit } from "@/components/Category";
import { Heading } from "@/components/Heading";
import styles from "./CategoryEditPage.module.css";

export const CategoryEditPage: FC = () => {
  return (
    <div className={styles.CategoryAddPage}>
      <Heading as='h1'>Редактировать категорию</Heading>
      <CategoryEdit />
    </div>
  );
};
