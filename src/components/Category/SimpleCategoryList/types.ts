import type { ICategoryTree } from "@/types";
import type { DragEndEvent } from "@dnd-kit/core";

interface ISimple {
	changeEdit: (category: ICategoryTree | null) => void;
	handleDragEnd: (event: DragEndEvent) => Promise<void>;
}

export interface ISimpleCategoryListProps extends ISimple {
	categories: ICategoryTree[];
	isLoading: boolean;
}

export interface ISimpleItemsProps extends ISimple {
	categories: ICategoryTree[];
	level: number;
}

export interface ISimpleItemProps extends ISimple {
	category: ICategoryTree;
	level: number;
}
