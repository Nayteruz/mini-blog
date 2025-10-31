import { type FC } from "react";
import { PostCreateForm } from "@components/Post";
import { Heading } from "@/components/Heading";
import styles from "./styles.module.css";

export const PostCreate: FC = () => {

  return (
    <div className={styles.PostCreatePage}>
      <Heading as="h1">Создать новый пост</Heading>
      <PostCreateForm />
    </div >
  );
};