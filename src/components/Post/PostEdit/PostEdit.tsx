import React, { useState, useEffect, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '@hooks/usePosts';
import { useCategories } from '@hooks/useCategories';
import { useStore } from "@/store";
import { PostForm } from "@/components/Post/PostForm/PostForm";

export const PostEditForm: FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { posts, updatePost, loading } = usePosts();
  const { categories, getCategoriesForSelect } = useCategories();
  const { user } = useStore();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedCategories = getCategoriesForSelect();
  const isSendDisabled = !title.trim() || !text.trim() || !categoryId || isSubmitting;

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
    <PostForm
      onSubmit={handleSubmit}
      title={title}
      setTitle={setTitle}
      categories={categories}
      orderedCategories={orderedCategories}
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      text={text}
      setText={setText}
      isSubmitting={isSubmitting}
      isDisabled={isSendDisabled}
      sendButtonText="Редактировать заметку"
    />
  );
};