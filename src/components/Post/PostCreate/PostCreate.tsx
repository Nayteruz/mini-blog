import { useCategories } from "@/hooks/useCategories";
import { usePosts } from "@/hooks/usePosts";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/configDb";
import { PostForm } from "@/components/Post/PostForm/PostForm";

export const PostCreateForm: FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, getCategoriesForSelect } = useCategories();
  const orderedCategories = getCategoriesForSelect();
  const [title, setTitle] = useState("");
  const [text, setText] = useState('Написать заметку...');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSendDisabled = !title.trim() || !text.trim() || !categoryId || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('Вы должны быть авторизованы для создания постов');
      return;
    }

    if (!title.trim() || !text.trim() || !categoryId) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      setIsSubmitting(true);

      // Находим выбранную категорию для получения path
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      if (!selectedCategory) {
        throw new Error('Категория не найдена');
      }

      const newPostData = {
        title: title.trim(),
        text: text.trim(),
        categoryId,
        categoryPath: selectedCategory.path,
        author: {
          name: auth.currentUser.displayName || "",
          id: auth.currentUser.uid,
        },
      };

      await createPost(newPostData);

      // Очистка формы и переход
      setTitle('');
      setText('');
      setCategoryId('');
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Ошибка при создании поста');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      sendButtonText="Создать заметку"
    />
  );
}