import type { HTMLAttributes, ReactNode } from "react";

type IButtonSize = "small" | "medium" | "large" | "square";
type IType = "button" | "submit" | "reset";
type IVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "disabled" | "purple";

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	onClick?: () => void;
	variant?: IVariant;
	type?: IType;
	disabled?: boolean;
	className?: string;
	size?: IButtonSize;
}
