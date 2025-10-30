import type { HTMLAttributes, ReactNode } from "react";

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary";
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	className?: string;
	size?: "small" | "medium" | "large";
}
