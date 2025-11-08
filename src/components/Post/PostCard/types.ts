import type { CSSProperties } from "react";
import type { ICategory, IPost } from "@/types";

export interface IPostCardProps {
  post: IPost;
  parts: visibleParts[];
  ownCategories?: ICategory[];
  isToggle?: boolean;
  className?: string;
  style?: CSSProperties;
}

type visibleParts = "header" | "footer" | "meta" | "category";
