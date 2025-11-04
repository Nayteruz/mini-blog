import type { ReactNode } from "react";

export interface IPost {
  id: string;
  title: string;
  text: string;
  author: {
    name: string;
    id: string;
  };
  categoryIds: string[];
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

export type ICreateCategoryData = Omit<ICategory, "id">;
export type IUpdateCategoryData = Omit<
  ICategory,
  "id" | "createdAt" | "createdBy"
> & {
  updatedAt: Date;
};

export interface ICategoryTree extends ICategory {
  children?: ICategoryTree[];
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
