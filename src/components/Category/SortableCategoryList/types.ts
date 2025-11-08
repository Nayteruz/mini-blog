import type { ICategory, ICategoryTree } from "@/types";
import type { DragEndEvent } from "@dnd-kit/core";

export interface ISortableListProps {
  onClickEdit: (categoryId: string) => void;
  categories: ICategoryTree[];
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  isLoading: boolean;
  onDelete: (categoryId: string) => Promise<void>;
  error: string | null;
}

export interface ISortableItemProps {
  category: ICategory & { children?: any[] };
  level: number;
  onDelete: (categoryId: string) => void;
  onClickEdit: (categoryId: string) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
}
