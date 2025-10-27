import type { ICategory } from "@/types";

export interface ISortableItemProps {
	category: ICategory & { children?: any[] };
	level: number;
	onDelete: (categoryId: string) => void;
	onEdit: (category: ICategory) => void;
}
