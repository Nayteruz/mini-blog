import type { FC, ReactNode } from "react";
import styles from "./Heading.module.css";

interface IHeadingProps {
  children: ReactNode;
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string
  error?: boolean
  disabled?: boolean
}

export const Heading: FC<IHeadingProps> = ({ children, as = 'h1', className, error, disabled }) => {

  const Component = as;

  return (
    <Component className={`${styles.Heading} ${styles[as] ? styles[as] : ''} ${className || ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}>
      {children}
    </Component>
  );
};