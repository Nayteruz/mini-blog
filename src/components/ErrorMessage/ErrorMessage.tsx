import { type FC, type ReactNode } from "react";
import styles from "./ErrorMessage.module.css";
import { Heading } from "../Heading";

interface IErrorMessageProps {
  title: string;
  children?: ReactNode;
}

export const ErrorMessage: FC<IErrorMessageProps> = ({ children, title }) => {
  return (
    <p className={styles.ErrorMessage}>
      <Heading as='h3' error>
        {title}
      </Heading>
      {children}
    </p>
  );
};
