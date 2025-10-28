import type { ICategoryTree } from "@/types";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export const findCategoryById = (tree: ICategoryTree[], id: string): ICategoryTree | null => {
	for (const item of tree) {
		if (item.id === id) return item;
		if (item.children) {
			const found = findCategoryById(item.children, id);
			if (found) return found;
		}
	}
	return null;
};

// Вспомогательная функция для получения соседних категорий
export const getSiblings = (tree: ICategoryTree[], parentId: string | null): ICategoryTree[] => {
	if (parentId === null) {
		return tree;
	}

	const findSiblings = (nodes: ICategoryTree[]): ICategoryTree[] => {
		for (const node of nodes) {
			if (node.id === parentId) {
				return node.children || [];
			}
			if (node.children) {
				const siblings = findSiblings(node.children);
				if (siblings.length > 0) return siblings;
			}
		}
		return [];
	};

	return findSiblings(tree);
};

export const onDragEnd = (event: DragEndEvent, categoryTree: ICategoryTree[]) => {
	const { active, over } = event;

	if (!over || active.id === over.id) {
		return;
	}

	// Находим родительскую категорию для активного элемента
	const activeCategory = findCategoryById(categoryTree, active.id as string);
	const overCategory = findCategoryById(categoryTree, over.id as string);

	if (!activeCategory || !overCategory) {
		return;
	}

	// Проверяем, что категории имеют одного родителя
	if (activeCategory.parentId !== overCategory.parentId) {
		alert("Можно сортировать только категории одного уровня вложенности");
		return;
	}

	const parentId = activeCategory.parentId;
	const siblings = getSiblings(categoryTree, parentId);

	const oldIndex = siblings.findIndex((item) => item.id === active.id);
	const newIndex = siblings.findIndex((item) => item.id === over.id);

	if (oldIndex !== -1 && newIndex !== -1) {
		return arrayMove(siblings, oldIndex, newIndex);
	}

	return categoryTree;
};
