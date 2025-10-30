import type { FC, ReactNode } from "react";
import styles from "./Heading.module.css";

interface IHeadingProps {
  children: ReactNode;
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string
}

export const Heading: FC<IHeadingProps> = ({ children, as = 'h1', className }) => {

  const Component = as;

  return (
    <Component className={`${styles.Heading} ${styles[as]} ${className || ''}`}>
      {children}
    </Component>
  );
};