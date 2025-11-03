import { useState, type FC } from 'react';
import { usePosts } from '@hooks/usePosts';
import { useCategories } from '@hooks/useCategories';
import { useNavigate } from "react-router-dom";
import { SearchAndFilter } from "@components/SearchAndFilter";
import { Spinner } from "@components/Spinner";
import { PAGES } from "@/contants";
import { PostCard } from "@components/Post";
import { Heading } from "@components/Heading";
import { Button } from "@components/Button";
import type { ICategory } from "@/types";
import { ArrowToggle } from "@components/ArrowToggle";
import styles from "./PostList.module.css";

const getOwnCategories = (categories: ICategory[], categoryIds: string[] = []) => {
  return categories.filter(cat => categoryIds.includes(cat.id));
};

export const PostsList: FC = () => {
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();
  const { categories } = useCategories();
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const toggleFilter = () => setIsOpenFilter((prev) => !prev);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (<Heading as="h4" error>{error}</Heading>);
  }

  return (
    <div className={styles.PostList}>
      <div className={styles.buttons}>
        <div className={styles.filter}>
          <Button variant="secondary" onClick={toggleFilter}>Фильтр</Button><ArrowToggle isOpen={isOpenFilter} className={styles.arrow} />
        </div>
        <Button onClick={() => navigate(PAGES.POST_CREATE.path)}>+ Создать пост</Button>
      </div>
      {isOpenFilter && <SearchAndFilter />}

      {posts.length === 0 && <Heading as="h4">Постов пока нет. Будьте первым, кто создаст пост!</Heading>}

      <div className={styles.listWrapper}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} parts={['meta', 'footer', 'header', "category"]} ownCategories={getOwnCategories(categories, post.categoryIds)} />
        ))}
      </div>
    </div >
  );
};