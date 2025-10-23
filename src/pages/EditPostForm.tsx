import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
// import '../styles/categories.css';
import { useStore } from "../store";

export const EditPostForm: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { posts, updatePost, loading } = usePosts();
  const { categories } = useCategories();
  const { user } = useStore();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Находим редактируемый пост
  const post = posts.find(p => p.id === postId);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setText(post.text);
      setCategoryId(post.categoryId);
    }
  }, [post]);

  // Проверяем права на редактирование
  useEffect(() => {
    if (post && user && post.author.id !== user.uid) {
      alert('У вас нет прав для редактирования этого поста');
      navigate('/');
    }
  }, [post, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !post) {
      alert('Ошибка доступа');
      return;
    }

    if (!title.trim() || !text.trim() || !categoryId) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      setIsSubmitting(true);

      const selectedCategory = categories.find(cat => cat.id === categoryId);
      if (!selectedCategory) {
        throw new Error('Категория не найдена');
      }

      await updatePost(postId!, {
        title: title.trim(),
        text: text.trim(),
        categoryId,
        categoryPath: selectedCategory.path
      });

      alert('Пост успешно обновлен!');
      navigate('/');
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Ошибка при обновлении поста');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-message">
        Пост не найден
      </div>
    );
  }

  return (
    <div className="categories-container">
      <h2 className="categories-title">Редактировать пост</h2>

      <div className="category-form">
        <form onSubmit={handleSubmit} className="form-fields">
          <div className="form-group">
            <label htmlFor="editPostTitle" className="form-label">
              Заголовок поста *
            </label>
            <input
              id="editPostTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок поста"
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editPostCategory" className="form-label">
              Категория *
            </label>
            <select
              id="editPostCategory"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-select"
              disabled={isSubmitting || categories.length === 0}
              required
            >
              <option value="">-- Выберите категорию --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {'→ '.repeat(category.depth)} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editPostText" className="form-label">
              Текст поста *
            </label>
            <textarea
              id="editPostText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите текст поста"
              className="form-input"
              rows={8}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="secondary-button"
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !text.trim() || !categoryId || isSubmitting}
              className="form-button"
            >
              {isSubmitting ? 'Обновление...' : 'Обновить пост'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};