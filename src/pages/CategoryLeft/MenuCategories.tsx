import type { ICategoryTree, IPost } from "@/types";
import type { FC } from "react";
import styles from "./CategoryLeft.module.css";
import { Button } from "@/components/Button";
import { CategoryMenu } from "@/components/Category";

interface IMenuCategoryProps {
  list: ICategoryTree[];
  selectedCategory?: ICategoryTree;
  posts: IPost[];
  isOpen: boolean;
  closeMenu: () => void;
}

export const MenuCategories: FC<IMenuCategoryProps> = ({
  isOpen,
  list,
  selectedCategory,
  posts,
  closeMenu,
}) => {
  return (
    <div
      className={`${styles.MenuCategories} ${isOpen ? styles.openFixed : ""}`}
    >
      <div className={styles.overlay} onClick={closeMenu}></div>
      <div className={styles.menuItems}>
        <Button
          variant='danger'
          size='smallest'
          onClick={closeMenu}
          className={styles.closeButton}
        >
          ×
        </Button>
        <CategoryMenu
          list={list}
          selectedCategory={selectedCategory}
          posts={posts}
        />
      </div>
    </div>
  );
};
