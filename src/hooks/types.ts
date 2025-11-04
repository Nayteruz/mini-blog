import type { ICategory, IUpdateCategoryData } from "@/types";
import type { SetStateAction } from "react";
import { SORT_TYPE } from "../contants";

export type ISortType = (typeof SORT_TYPE)[keyof typeof SORT_TYPE];

export interface ICreateCategoryHookArguments {
  name: string;
  parentId: string | null;
  userId: string;
}

export interface ICreateCategoryDataParams {
  categories: ICategory[];
  name: string;
  parentId: string | null;
  userId: string;
}

export interface IUpdateCategoryHookArguments {
  categoryId: string;
  name: string;
  newParentId: string | null;
}

export interface IUpdateCategoryDataParams {
  categories: ICategory[];
  categoryToUpdate: ICategory;
  categoryId: string;
  name: string;
  newParentId: string | null;
  setCategories: (value: SetStateAction<ICategory[]>) => void;
}

export interface IUpdateCategoryDataResult {
  updateData: IUpdateCategoryData;
  newPath: string[];
  updatedCategories: ICategory[];
}
