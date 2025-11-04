import type { ICategory, ICategoryTree } from "@/types";
import type { DragEndEvent } from "@dnd-kit/core";

export interface ISortableListProps {
  changeEdit: (category: ICategory) => void;
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
  onEdit: (category: ICategory) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
}
