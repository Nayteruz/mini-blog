import type { FC } from "react";
import type { IButtonProps } from "./types";
import styles from "./Button.module.css";

export const Button: FC<IButtonProps> = ({ text, onClick, variant = "primary", ...props }) => {
  const className = `${styles.Button} ${styles[variant]} ${props.className ? props.className : ''}`;

  return (
    <button type={props.type || "button"} className={className} onClick={onClick} {...props}>
      {text}
    </button>
  );
};