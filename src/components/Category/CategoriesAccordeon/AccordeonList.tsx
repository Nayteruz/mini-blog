import { type FC } from 'react';
import { useCategories } from '@hooks/useCategories';
import { usePosts } from '@hooks/usePosts';
import { Spinner } from "@/components/Spinner";
import { AccordeonItem } from "./AccordeonItem";
import styles from "./AccordeonList.module.css";

interface IAccordeonListProps {
  title?: string;
}

export const AccordeonList: FC<IAccordeonListProps> = ({ title }) => {
  const { categoryTree, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { posts, loading: postsLoading, error: postsError } = usePosts();

  if (categoriesLoading || postsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (categoriesError || postsError) {
    return (
      <div className={styles.errorMessage}>
        {categoriesError || postsError}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title || 'Список категорий'}</h2>

      {categoryTree.length === 0 ? (
        <div className={styles.emptyState}>
          Список категорий пуст!
        </div>
      ) : (
        <div className={styles.wrapper}>
          {categoryTree.map(category => (
            <AccordeonItem
              key={category.id}
              category={category}
              level={0}
              posts={posts}
            />
          ))}
        </div>
      )}
    </div>
  );
};