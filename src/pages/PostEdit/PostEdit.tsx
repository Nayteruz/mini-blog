import { type FC } from "react";
import { PostEditForm } from "@components/Post";
import { Heading } from "@/components/Heading";
import styles from "./styles.module.css";

export const PostEdit: FC = () => {
  return (
    <div className={styles.PostEditPage}>
      <Heading as="h1">Редактировать заметку</Heading>
      <PostEditForm />
    </div >
  );
};