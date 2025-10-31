import type { ReactNode } from "react";

export interface IPost {
	id: string;
	title: string;
	text: string;
	author: {
		name: string;
		id: string;
	};
	categoryId: string;
	categoryPath: string[];
	createdAt: any;
}

export type ICreatePostData = Omit<IPost, "id">;

export type IUpdatePostData = Omit<IPost, "id" | "createdAt" | "author"> & {
	updatedAt?: Date;
};

export interface ICategory {
	id: string;
	name: string;
	parentId: string | null;
	path: string[];
	depth: number;
	createdAt: any; // Firebase timestamp
	createdBy: string;
	order: number;
}

export interface ICategoryTree extends ICategory {
	children?: ICategoryTree[];
}

export interface ICreateCategoryData {
	name: string;
	parentId: string | null;
	path: string[];
	depth: number;
	createdAt: any;
	createdBy: string;
	order: number;
}

export interface IUpdateCategoryData {
	name: string;
	parentId: string | null;
	path: string[];
	depth: number;
	updatedAt: any;
	order: number;
}

export interface ITabItem {
	key: string;
	name: string;
	content: ReactNode;
}

export interface IMenuItem {
	title: string;
	path: string;
	isAuth: boolean;
	pathOrigin?: string;
}
