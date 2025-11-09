import { useState, type FC, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { ICategoryTree, IPost } from "@/types";
import { PAGES } from "@/contants";
import { ArrowToggle } from "@/components/ArrowToggle/ArrowToggle";
import styles from "./CategoryMenu.module.css";

interface ICategoryMenuProps {
  list: ICategoryTree[];
  posts: IPost[];
  onClick?: () => void;
  className?: string;
  selectedPath: string[];
}

interface ICategoryItemProps {
  category: ICategoryTree;
  posts: IPost[];
  selectedPath: string[];
}

const ItemMenu: FC<ICategoryItemProps> = ({ category, posts, selectedPath }) => {
  const [isOpen, setIsOpen] = useState(selectedPath.includes(category.id));
  const children = category?.children || [];
  const postsCount = posts?.filter(post => (post.categoryIds || []).includes(category.id)).length || 0;

  const toggleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <Link
        className={`${styles.link} ${selectedPath.includes(category.id) ? styles.active : ""}`}
        to={`${PAGES.CATEGORIES_LEFT.pathOrigin}/${category.id}`}
      >
        <span>
          {category.name}
          <sup>({postsCount})</sup>
        </span>
        {children.length > 0 && <ArrowToggle className={styles.arrow} isOpen={isOpen} onClick={e => toggleOpen(e)} />}
      </Link>
      {children.length > 0 && (
        <ul className={isOpen ? styles.isOpen : ""}>
          {children?.map(item => (
            <ItemMenu key={item.id} category={item} posts={posts} selectedPath={selectedPath} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const CategoryMenu: FC<ICategoryMenuProps> = ({ list, posts, onClick, className, selectedPath }) => {
  return (
    <nav className={`${styles.CategoryMenu} ${className || ""}`}>
      <ul className={styles.menuUl} onClick={onClick}>
        {list.map(item => (
          <ItemMenu key={item.id} category={item} posts={posts} selectedPath={selectedPath} />
        ))}
      </ul>
    </nav>
  );
};
