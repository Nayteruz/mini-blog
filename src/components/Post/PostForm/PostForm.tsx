import type { FC } from "react";
import styles from "./PostForm.module.css";
import { ListRow } from "@/components/ListRow/ListRow";
import { Input } from "@/components/Input";
import { SelectCategory } from "@/components/Category";
import { TextEditor } from "@/components/TextEditor/TextEditor";
import { Button } from "@/components/Button";
import type { IPostFormProps } from "./types";
import { useNavigate } from "react-router-dom";


export const PostForm: FC<IPostFormProps> = (props) => {
  const navigate = useNavigate();
  const { className, onSubmit, title, setTitle, categories, orderedCategories, categoryId, setCategoryId, text, setText, isSubmitting, isDisabled, sendButtonText = "Отправить" } = props;

  return (
    <form onSubmit={onSubmit} className={`${styles.PostForm} ${className || ''}`}>
      <ListRow
        label="Название заметки"
        required
      >
        <Input
          value={title}
          setValue={setTitle}
          placeholder="Название заметки..."
          required
        />
      </ListRow>
      <ListRow
        label="Категория(если не выбирать то пост будет создан в корневой категории)"
        note={`${categories.length === 0 ? 'Сначала создайте категории в разделе "Управление категориями"' : ''}`}
        required
      >
        <SelectCategory
          value={categoryId}
          onChange={setCategoryId}
          categories={orderedCategories}
          rootTextSelect="Выберите категорию"
        />
      </ListRow>
      <ListRow
        label="Описание заметки"
        required
      >
        <TextEditor content={text} setContent={setText} />
      </ListRow>
      <div className={styles.buttons}>
        <Button type="button" onClick={() => navigate('/')} variant="secondary" disabled={isSubmitting}>
          Отмена
        </Button>
        <Button type="submit" disabled={isDisabled}>
          {isSubmitting ? 'Отправка данных...' : sendButtonText}
        </Button>
      </div>
    </form>
  );
}