import type { FC } from "react";
import { CategoriesList } from "../components/CategoryList";

export const CategoriesPage: FC = () => {
  return (
    <div className="categories-page">
      <h1>Страница категории</h1>
      <CategoriesList />
    </div>
  );
};