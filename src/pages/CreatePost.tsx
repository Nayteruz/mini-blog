import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { TextEditor } from "../components/TextEditor";
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import { SelectCategory } from "@/components/Category/SelectCategory/SelectCategory";
import { Input } from "@/components/Input";

export const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, getCategoriesForSelect } = useCategories();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("Напишите заметку...");
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedCategories = getCategoriesForSelect();

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

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/sign-in");
    }
  }, [navigate]);

  return (
    <div className="create-post-page">
      <div className="categories-container">
        <h2 className="categories-title">Создать новый пост</h2>

        <div className="category-form">
          <form onSubmit={handleSubmit} className="form-fields">
            <Input
              value={title}
              setValue={setTitle}
              label="Заголовок поста"
              placeholder="Введите заголовок поста"
              required
            />
            <SelectCategory
              classWrapper="form-group"
              label="Категория(если не выбирать то пост будет создан в корневой категории)"
              value={categoryId}
              onChange={setCategoryId}
              categories={orderedCategories}
              rootTextSelect="Выберите категорию"
            />
            {categories.length === 0 && (
              <p className="form-help">
                Сначала создайте категории в разделе "Управление категориями"
              </p>
            )}
            <div className="form-group">
              <label htmlFor="postText" className="form-label">
                Текст поста *
              </label>
              <TextEditor content={text} setContent={setText} />
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
                {isSubmitting ? 'Создание...' : 'Создать пост'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
};