import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { TextEditor } from "../components/TextEditor";
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";

export const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("Напишите заметку...");
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, []);

  return (
    <div className="create-post-page">
      <div className="categories-container">
        <h2 className="categories-title">Создать новый пост</h2>

        <div className="category-form">
          <form onSubmit={handleSubmit} className="form-fields">
            <div className="form-group">
              <label htmlFor="postTitle" className="form-label">
                Заголовок поста *
              </label>
              <input
                id="postTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите заголовок поста"
                className="form-input"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="postCategory" className="form-label">
                Категория *
              </label>
              <select
                id="postCategory"
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
              {categories.length === 0 && (
                <p className="form-help">
                  Сначала создайте категории в разделе "Управление категориями"
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="postText" className="form-label">
                Текст поста *
              </label>
              {/* <textarea
                id="postText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите текст поста"
                className="form-input"
                rows={6}
                disabled={isSubmitting}
              /> */}
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