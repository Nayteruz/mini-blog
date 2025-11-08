import type { ICategoryTree } from "@/types";
import type { DragEndEvent } from "@dnd-kit/core";

interface ISimple {
  onClickEdit: (categoryId: string) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export interface ISimpleCategoryListProps extends ISimple {
  categories: ICategoryTree[];
  isLoading: boolean;
  onDelete: (categoryId: string) => Promise<void>;
}

export interface ISimpleItemsProps extends ISimple {
  categories: ICategoryTree[];
  level: number;
}

export interface ISimpleItemProps extends ISimple {
  category: ICategoryTree;
  level: number;
}
