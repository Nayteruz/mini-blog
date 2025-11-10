import { type FC } from "react";
import { useCategories } from "@hooks/useCategories";
import { usePosts } from "@hooks/usePosts";
import { Spinner } from "@/components/Spinner";
import { AccordeonItem } from "./AccordeonItem";
import { Heading } from "@/components/Heading";
import styles from "./AccordeonList.module.css";
import { ErrorMessage } from "@/components/ErrorMessage";

export const AccordeonList: FC = () => {
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
    return <ErrorMessage title={categoriesError || postsError || ""} />;
  }

  if (categoryTree.length === 0) {
    return <Heading as='h4'>Список категорий пуст!</Heading>;
  }

  return (
    <div className={styles.AccordeonList}>
      {categoryTree.map(category => (
        <AccordeonItem key={category.id} category={category} level={0} posts={posts} />
      ))}
    </div>
  );
};
