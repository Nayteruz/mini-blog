import type { CSSProperties } from "react";
import type { IPost } from "../../types";

export interface IPostCardProps {
	post: IPost;
	parts: visibleParts[];
	category?: string;
	isToggle?: boolean;
	className?: string;
	style?: CSSProperties;
}

type visibleParts = "header" | "footer" | "meta" | "category";
