import type { FC } from "react";
import styles from "./ArrowToggle.module.css";

interface IArrowToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  className?: string;
}

export const ArrowToggle: FC<IArrowToggleProps> = ({ isOpen, className, ...props }) => {
  const classes = `${styles.arrow}${className ? ` ${className}` : ""}`;

  return (
    <button {...props} className={classes}>
      {isOpen ? "▲" : "▼"}
    </button>
  );
};
