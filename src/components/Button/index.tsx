import type { FC } from "react";
import type { IButtonProps } from "./types";
import styles from "./Button.module.css";

export const Button: FC<IButtonProps> = ({ children, onClick, variant = "primary", size, className = '', ...props }) => {
  const classes = `${styles.Button} ${styles[variant]} ${className ? className : ''} ${size ? styles[size] : ''}`;

  return (
    <button type={props.type || "button"} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};