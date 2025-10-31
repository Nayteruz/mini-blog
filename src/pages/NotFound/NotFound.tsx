import type { FC } from "react";
import { Heading } from "@/components/Heading"
import styles from "./NotFound.module.css"
import { Link } from "react-router-dom";

export const NotFoundPage: FC = () => {
  return (
    <div className={styles.NotFoundPage}>
      <Heading as="h1" className={styles.title}>404</Heading>
      <p>Страница не найдена <Link to="/" className={styles.link}>вернуться на главную</Link></p>
    </div>
  );
};