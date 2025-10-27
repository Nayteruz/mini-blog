import type { FC } from "react";
import type { IButtonProps } from "./types";
import styles from "./Button.module.css";

export const Button: FC<IButtonProps> = ({ text, onClick, variant = "primary", className = '', ...props }) => {
  const classes = `${styles.Button} ${styles[variant]} ${className ? className : ''}`;

  return (
    <button type={props.type || "button"} className={classes} onClick={onClick} {...props}>
      {text}
    </button>
  );
};