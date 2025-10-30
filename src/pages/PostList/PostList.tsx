import { Heading } from "@/components/Heading/Heading";
import { PostsList } from "@/components/PostList";
import styles from "./PostList.module.css";
import type { FC } from "react";

export const PostList: FC = () => {

  return (
    <div className={styles.PostListPage}>
      <Heading as="h1">Список постов</Heading>
      <Heading as="h4">Добавить пагинацию потом</Heading>
      <PostsList />
    </div >
  );
};