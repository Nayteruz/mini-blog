import type { ICategory } from "@/types";
import type { FormEvent } from "react";

export interface IPostFormProps {
	onSubmit: (e: FormEvent) => Promise<void>;
	className?: string;
	title: string;
	setTitle: (title: string) => void;
	text: string;
	setText: (text: string) => void;
	categoryId: string;
	setCategoryId: (categoryId: string) => void;
	categories: ICategory[];
	orderedCategories: ICategory[];
	isSubmitting: boolean;
	isDisabled: boolean;
	sendButtonText?: string;
}
