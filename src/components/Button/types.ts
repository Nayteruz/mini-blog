import type { HTMLAttributes, ReactNode } from "react";

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
	text: ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary";
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
}
