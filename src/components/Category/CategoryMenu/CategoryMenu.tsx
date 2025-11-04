import { useState, type FC, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { ICategoryTree, IPost } from "@/types";
import { PAGES } from "@/contants";
import { ArrowToggle } from "@/components/ArrowToggle";
import styles from "./CategoryMenu.module.css";


interface ICategoryMenuProps {
  list: ICategoryTree[];
  selectedCategory?: ICategoryTree;
  posts: IPost[];
  onClick?: () => void
  className?: string
}

interface ICategoryItemProps {
  category: ICategoryTree;
  selectedCategory?: ICategoryTree;
  posts: IPost[];
}

const ItemMenu: FC<ICategoryItemProps> = ({ category, selectedCategory, posts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = category?.children || [];
  const postsCount = posts?.filter(post => (post.categoryIds || []).includes(category.id)).length || 0;

  const toggleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  return (
    <li>
      <Link className={`${styles.link} ${selectedCategory?.id === category.id ? styles.active : ''}`} to={`${PAGES.CATEGORIES_LEFT.pathOrigin}/${category.id}`}>
        <span>{category.name}<sup>({postsCount})</sup></span>
        {children.length > 0 && <ArrowToggle className={styles.arrow} isOpen={isOpen} onClick={(e) => toggleOpen(e)} />}
      </Link>
      {children.length > 0 && (
        <ul className={isOpen ? styles.isOpen : ''}>
          {children?.map((item) => <ItemMenu key={item.id} category={item} selectedCategory={selectedCategory} posts={posts} />)}
        </ul>
      )}
    </li>
  );
}

export const CategoryMenu: FC<ICategoryMenuProps> = ({ list, selectedCategory, posts, onClick, className }) => {
  return (
    <nav className={`${styles.CategoryMenu} ${className || ''}`}>
      <ul className={styles.menuUl} onClick={onClick}>
        {list.map((item) => <ItemMenu key={item.id} category={item} selectedCategory={selectedCategory} posts={posts} />)}
      </ul>
    </nav>
  );
}