import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { useStore } from "@/store";
import type { ICategory } from "@/types";
import { ListRow } from "@/components/ListRow";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { SelectCategory } from "../SelectCategory/SelectCategory";
import styles from "./CategoryForm.module.css";

interface ICategoryFormProps {
  onSubmitForm: (name: string, parentId: string | null, userId?: string) => Promise<void>;
  categories: ICategory[];
  isLoading?: boolean;
  error: string | null;
  selectedCategory?: ICategory | null;
  sumbitButtonText?: string;
  submittingButtonText?: string;
}

export const CategoryForm: FC<ICategoryFormProps> = props => {
  const {
    onSubmitForm,
    categories = [],
    isLoading = false,
    error = null,
    selectedCategory = null,
    sumbitButtonText = "Создать",
    submittingButtonText = "Создание...",
  } = props;
  const { user } = useStore();
  const [categoryName, setCategoryName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
      setSelectedParentId(selectedCategory.parentId);
    }
  }, [selectedCategory]);

  const onChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedParentId(e.target.value);
    setFormError(null);
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
    setFormError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setFormError(null);
      await onSubmitForm(categoryName, selectedParentId, user?.uid || "anonimus");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Произошла ошибка при создании категории";
      setFormError(errorMessage);
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = formError || error;

  return (
    <form onSubmit={onSubmit} className={styles.CategoryForm}>
      <ListRow label='Название категории' required>
        <Input value={categoryName} onChange={onChangeInput} placeholder='Название категории...' required />
      </ListRow>
      <ListRow
        label='Родительская категория (необязательно)'
        note='Eсли не выбрать, категория будет создана в корне'
        required
      >
        <SelectCategory
          value={selectedParentId || ""}
          onChange={onChangeSelect}
          disabledId={selectedCategory?.id}
          categories={categories}
          emptyText='Корневая категория'
        />
      </ListRow>
      {displayError && (
        <Heading as='h4' error>
          {displayError}
        </Heading>
      )}
      <Button type='submit' disabled={!categoryName.trim() || isSubmitting || isLoading}>
        {isSubmitting ? submittingButtonText : sumbitButtonText}
      </Button>
    </form>
  );
};
