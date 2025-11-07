import type { FC, ReactNode } from "react";
import styles from "./PageWrapper.module.css";

interface IPageWrapperProps {
  children: ReactNode;
}

export const PageWrapper: FC<IPageWrapperProps> = ({ children }) => {
  return (
    <article className={styles.PageWrapper}>
      <div className={styles.content}>{children}</div>
    </article>
  );
};
