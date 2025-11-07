import { useMemo, useState, type FC } from "react";
import { Heading } from "@/components/Heading";
import { useCategories } from "@/hooks/useCategories";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/Spinner";
import { usePosts } from "@/hooks/usePosts";
import { PostLeft } from "@components/Post";
import { Button } from "@/components/Button";
import { MenuCategories } from "./MenuCategories";
import MenuIcon from "@assets/icons/barsIcon.svg?react";
import styles from "./CategoryLeft.module.css";

export const CategoryLeft: FC = () => {
  const {
    categoryTree,
    categories,
    loading: categoriesLoading,
  } = useCategories();
  const { posts, loading: postsLoading } = usePosts();
  const { categoryId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = useMemo(
    () => categories.find(cat => cat.id === categoryId),
    [categories, categoryId]
  );
  const categoryPosts = posts.filter(post =>
    (post.categoryIds || []).includes(selectedCategory?.id || "")
  );

  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  if (categoriesLoading || postsLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Spinner />
      </div>
    );
  }

  if (categoryId && !selectedCategory) {
    return (
      <div className={styles.CategoryLeft}>
        <div className={styles.error}>
          <Heading as='h1'>Категория не найдена</Heading>
        </div>
        <Heading as='h5'>Категория либо удалена либо не существует</Heading>
      </div>
    );
  }

  return (
    <article className={styles.CategoryLeft}>
      <aside className={styles.categories}>
        <Button variant='purple' onClick={toggleOpen} className={styles.button}>
          <MenuIcon />
          Категории
        </Button>
        <MenuCategories
          list={categoryTree}
          selectedCategory={selectedCategory}
          posts={posts}
          isOpen={isOpen}
          closeMenu={closeMenu}
        />
      </aside>
      <main className={styles.notesContent}>
        <Heading as='h1'>
          {selectedCategory?.name || "Категории с постами"}
        </Heading>
        <div className={styles.posts}>
          {categoryPosts.map(post => (
            <PostLeft key={post.id} post={post} />
          ))}
        </div>
      </main>
    </article>
  );
};
