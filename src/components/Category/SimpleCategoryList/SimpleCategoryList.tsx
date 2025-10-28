import type { ICategoryTree } from "@/types";
import type { FC } from "react";
import EditIcon from '@assets/icons/penToSquare.svg?react';
import { Button } from "@/components/Button";
import styles from "./SimpleCategoryList.module.css";

interface ISimple {
  changeEdit: (category: ICategoryTree | null) => void;
}

interface ISimpleCategoryListProps extends ISimple {
  categories: ICategoryTree[];
}

interface ISimpleItemsProps extends ISimple {
  categories: ICategoryTree[];
  level: number
}

interface ISimpleItemProps extends ISimple {
  category: ICategoryTree;
  level: number
}

const SimpleItem: FC<ISimpleItemProps> = ({ category, changeEdit, level }) => {
  return (
    <>
      <div className="simple-item" style={{ marginLeft: `${level * 15}px` }}>
        <div className="item-info">
          <span className="item-name">{category.name}</span>
          {/* <div className="item-details">
            ID: {category.id} | Уровень: {category.depth} |
            Родитель: {category.parentId || 'корневая'}
          </div> */}
        </div>
        <Button className={styles.button} variant="primary" onClick={() => changeEdit(category)}><EditIcon className={styles.icon} /></Button>
      </div>
      {category?.children && category?.children?.length > 0 && <SimpleItems categories={category.children} changeEdit={changeEdit} level={level + 1} />}
    </>
  )
}

const SimpleItems: FC<ISimpleItemsProps> = ({ categories, changeEdit, level }) => {
  return (
    categories.map(category => (<SimpleItem key={category.id} category={category} changeEdit={changeEdit} level={level} />))
  )
}


export const SimpleCategoryList: FC<ISimpleCategoryListProps> = ({ categories, changeEdit }) => {
  return (
    <div className="card">
      <h3 className="card-title">Простой список всех категорий</h3>

      {categories.length === 0 ? (
        <div className="empty-state">
          Категорий пока нет
        </div>
      ) : (
        <div className="simple-list">
          <SimpleItems categories={categories} changeEdit={changeEdit} level={0} />
        </div>
      )}
    </div>
  );
};