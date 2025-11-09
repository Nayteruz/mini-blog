import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@hooks/useCategories";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableList } from "../SortableCategoryList/SortableList";
import { SimpleCategoryList } from "../SimpleCategoryList/SimpleCategoryList";
import { Spinner } from "@/components/Spinner";
import { Tabs } from "@/components/Tabs";
import { onDragEnd } from "../SortableCategoryList/utils";
import { PAGES, VIEW_TYPE } from "@/contants";
import { Button } from "@/components/Button";
import styles from "./CategoriesList.module.css";
import type { IVievType } from "@/types";

export const CategoriesList: FC = () => {
  const { categoryTree, loading, reorderCategories, deleteCategory, error } = useCategories();
  const [activeTab, setActiveTab] = useState<IVievType>(VIEW_TYPE.LIST);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const navigate = useNavigate();

  const onAddCategory = () => {
    navigate(PAGES.CATEGORY_ADD.path);
  };

  const onClickEdit = (categoryId: string) => {
    navigate(`${PAGES.CATEGORY_EDIT.pathOrigin}/${categoryId}`);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const newOrder = onDragEnd(event, categoryTree);
    try {
      await reorderCategories(newOrder || []);
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  useEffect(() => {
    if (!isFirstLoad) {
      setIsFirstLoad(true);
    }
  }, [loading, isFirstLoad]);

  const views = [
    {
      key: VIEW_TYPE.LIST,
      name: "Простой список",
      content: (
        <SimpleCategoryList
          categories={categoryTree}
          isLoading={loading}
          handleDragEnd={handleDragEnd}
          onClickEdit={onClickEdit}
          onDelete={deleteCategory}
        />
      ),
    },
    {
      key: VIEW_TYPE.TREE,
      name: "Древовидный вид",
      content: (
        <SortableList
          categories={categoryTree}
          isLoading={loading}
          handleDragEnd={handleDragEnd}
          onClickEdit={onClickEdit}
          onDelete={deleteCategory}
          error={error}
        />
      ),
    },
  ];

  if (loading && !isFirstLoad) {
    return (
      <div className={styles.loaderWrapper}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Button className={styles.buttonAdd} onClick={onAddCategory}>
        Добавить категорию <span>+</span>
      </Button>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} list={views} />
    </>
  );
};
