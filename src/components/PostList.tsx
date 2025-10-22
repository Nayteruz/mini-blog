import React from 'react';
import { usePosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';


export const PostsList: React.FC = () => {
  const { posts, loading, error } = usePosts();
  const { categories } = useCategories();

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
      <h2 className="categories-title">Все посты</h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          Постов пока нет. Будьте первым, кто создаст пост!
        </div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-meta">
                  <span className="post-category">
                    Категория: {getCategoryName(post.categoryId)}
                  </span>
                  <span className="post-author">
                    Автор: {post.author.name || 'Аноним'}
                  </span>
                  <span className="post-date">
                    {post.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || 'Неизвестно'}
                  </span>
                </div>
              </div>
              <div className="post-content">
                {post.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};