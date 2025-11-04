import { useCategories } from "@/hooks/useCategories";
import { usePosts } from "@/hooks/usePosts";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/configDb";
import { PostForm } from "@/components/Post/PostForm/PostForm";
import { PAGES } from "@/contants";

export const PostCreateForm: FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, orderedCategories } = useCategories();
  const [title, setTitle] = useState("");
  const [text, setText] = useState('Написать заметку...');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSendDisabled = !title.trim() || !text.trim() || !categoryIds.length || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('Вы должны быть авторизованы для создания постов');
      return;
    }

    if (!title.trim() || !text.trim() || !categoryIds.length) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      setIsSubmitting(true);

      const newPostData = {
        title: title.trim(),
        text: text.trim(),
        categoryIds,
        author: {
          name: auth.currentUser.displayName || "",
          id: auth.currentUser.uid,
        },
      };

      console.log(newPostData);

      await createPost(newPostData);

      // Очистка формы и переход
      setTitle('');
      setText('');
      setCategoryIds([]);
      navigate(PAGES.MAIN.path);
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
      categoryIds={categoryIds}
      setCategoryIds={setCategoryIds}
      text={text}
      setText={setText}
      isSubmitting={isSubmitting}
      isDisabled={isSendDisabled}
      sendButtonText="Создать заметку"
    />
  );
}