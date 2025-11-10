import { ArrowToggle } from "@/components/ArrowToggle/ArrowToggle";
import { PostCard } from "@/components/Post";
import type { ICategoryTree, IPost } from "@/types";
import { useState, type FC } from "react";
import styles from "./AccordeonItem.module.css";

interface IAccordeonItemProps {
  category: ICategoryTree;
  level: number;
  posts: IPost[];
}

export const AccordeonItem: FC<IAccordeonItemProps> = ({ category, level, posts }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const childCategories = category?.children || [];
  const categoryPosts = posts.filter(post => (post.categoryIds || []).includes(category.id));

  const hasChildren = childCategories.length > 0;
  const hasPosts = categoryPosts.length > 0;
  const isEmpty = !hasChildren && !hasPosts;

  return (
    <div className={styles.AccordeonItem}>
      <div
        className={`${styles.header} ${isExpanded ? styles.expanded : ""} ${isEmpty ? styles.empty : ""}`}
        onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
      >
        <div className={styles.title}>
          <span className={styles.name}>{category.name}</span>
          <span className={styles.count}>{`(${categoryPosts.length} постов)`}</span>
        </div>

        {!isEmpty && <ArrowToggle isOpen={isExpanded} />}
      </div>

      {isExpanded && (
        <div className={styles.categoryContent}>
          {/* Посты этой категории */}
          {hasPosts && (
            <div className={styles.categoryPosts}>
              {categoryPosts.map(post => (
                <PostCard key={post.id} post={post} parts={["header", "footer"]} isToggle />
              ))}
            </div>
          )}

          {/* Дочерние категории */}
          {hasChildren && (
            <>
              {childCategories.map(childCategory => (
                <AccordeonItem key={childCategory.id} category={childCategory} level={level + 1} posts={posts} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
