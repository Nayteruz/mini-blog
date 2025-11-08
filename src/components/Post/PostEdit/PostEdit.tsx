import React, { useState, useEffect, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePosts } from "@hooks/usePosts";
import { useCategories } from "@hooks/useCategories";
import { PostForm } from "@/components/Post/PostForm/PostForm";
import { useStore } from "@/store";
import { PAGES } from "@/contants";

export const PostEditForm: FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { posts, updatePost, loading } = usePosts();
  const { categories, orderedCategories } = useCategories();
  const { user } = useStore();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSendDisabled = !title.trim() || !text.trim() || !categoryIds.length || isSubmitting;

  // Находим редактируемый пост
  const post = posts.find(p => p.id === postId);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setText(post.text);
      setCategoryIds(post.categoryIds || []);
    }
  }, [post]);

  // Проверяем права на редактирование
  useEffect(() => {
    if (post && user && post.author.id !== user.uid) {
      alert("У вас нет прав для редактирования этого поста");
      navigate(PAGES.MAIN.path);
    }
  }, [post, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !post) {
      alert("Ошибка доступа");
      return;
    }

    if (!title.trim() || !text.trim() || !categoryIds.length) {
      alert("Заполните все обязательные поля");
      return;
    }

    try {
      setIsSubmitting(true);

      await updatePost(postId!, {
        title: title.trim(),
        text: text.trim(),
        categoryIds,
      });

      navigate(PAGES.MAIN.path);
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Ошибка при обновлении поста");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='loading-text'>Загрузка...</div>
      </div>
    );
  }

  if (!post) {
    return <div className='error-message'>Пост не найден</div>;
  }

  return (
    <PostForm
      onSubmit={handleSubmit}
      title={title}
      setTitle={setTitle}
      categories={categories}
      orderedCategories={orderedCategories}
      categoryIds={categoryIds}
      setCategoryIds={setCategoryIds}
      text={text}
      setText={setText}
      isSubmitting={isSubmitting}
      isDisabled={isSendDisabled}
      sendButtonText='Редактировать заметку'
    />
  );
};
