import type { ChangeEvent, FC } from "react";
import { useNavigate } from "react-router-dom";
import { ListRow } from "@/components/ListRow/ListRow";
import { Input } from "@/components/Input";
import { SelectCategoryMultiple } from "@/components/Category";
import { TextEditor } from "@/components/TextEditor/TextEditor";
import { Button } from "@/components/Button";
import { PAGES } from "@/contants";
import type { IPostFormProps } from "./types";
import styles from "./PostForm.module.css";


export const PostForm: FC<IPostFormProps> = (props) => {
  const navigate = useNavigate();
  const { className, onSubmit, title, setTitle, categories, orderedCategories, categoryIds, setCategoryIds, text, setText, isSubmitting, isDisabled, sendButtonText = "Отправить" } = props;

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  return (
    <form onSubmit={onSubmit} className={`${styles.PostForm} ${className || ''}`}>
      <ListRow
        label="Название заметки"
        required
      >
        <Input
          value={title}
          onChange={onChangeInput}
          placeholder="Название заметки..."
          required
        />
      </ListRow>
      <ListRow
        label="Категория"
        note={`${categories.length === 0 ? 'Сначала создайте категории в разделе "Управление категориями"' : ''}`}
        required
      >
        <SelectCategoryMultiple
          value={categoryIds}
          onChange={setCategoryIds}
          maxCategories={5}
          categories={categories}
          orderedCategories={orderedCategories}
        />
      </ListRow>
      <ListRow
        label="Описание заметки"
        required
      >
        <TextEditor content={text} setContent={setText} />
      </ListRow>
      <div className={styles.buttons}>
        <Button type="button" onClick={() => navigate(PAGES.MAIN.path)} variant="secondary" disabled={isSubmitting}>
          Отмена
        </Button>
        <Button type="submit" disabled={isDisabled}>
          {isSubmitting ? 'Отправка данных...' : sendButtonText}
        </Button>
      </div>
    </form>
  );
}