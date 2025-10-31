import { type FC } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { useNavigate } from "react-router-dom";
import { SearchAndFilter } from "./SearchAndFilter";
import { PostCard } from "./Post";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { PAGES } from "@/contants";


export const PostsList: FC = () => {
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();
  const { categories } = useCategories();
  // const { user } = useStore();

  // Функция для получения названия категории по ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка постов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="posts-header">
        <Heading as="h3">Все посты</Heading>
        <Button onClick={() => navigate(PAGES.POST_CREATE.path)}>+ Создать пост</Button>
      </div>
      <SearchAndFilter />
      {posts.length === 0 ? (
        <div className="empty-state">
          Постов пока нет. Будьте первым, кто создаст пост!
        </div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <PostCard key={post.id} post={post} parts={['meta', 'footer', 'header', "category"]} category={getCategoryName(post.categoryId)} />
          ))}
        </div>
      )
      }
    </div >
  );
};