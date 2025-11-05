import type { FC } from "react";
import styles from "./Spinner.module.css";

interface ISpinnerProps {
  size?: number;
}

export const Spinner: FC<ISpinnerProps> = ({ size = 48 }) => {
  return (
    <span className={styles.loader} style={{ width: size, height: size }}></span>
  );
};