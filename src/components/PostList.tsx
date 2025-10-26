import { type FC } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
// import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { SearchAndFilter } from "./SearchAndFilter";
import { PostCard } from "./PostCard";


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

  // const handleEdit = (postId: string) => {
  //   navigate(`/edit-post/${postId}`);
  // };

  // const handleDelete = async (postId: string, postTitle: string) => {
  //   if (window.confirm(`Вы уверены, что хотите удалить пост "${postTitle}"?`)) {
  //     try {
  //       await deletePost(postId);
  //       alert('Пост успешно удален!');
  //     } catch (err) {
  //       alert('Ошибка при удалении поста' + err);
  //     }
  //   }
  // };

  // const canEditPost = (postAuthorId: string) => {
  //   return user && user.uid === postAuthorId;
  // };

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
        <h2 className="categories-title">Все посты</h2>
        <button
          onClick={() => navigate('/create-post')}
          className="create-post-button"
        >
          + Создать пост
        </button>
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