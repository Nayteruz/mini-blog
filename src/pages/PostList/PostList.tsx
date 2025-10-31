import type { FC } from "react";
import { Heading } from "@/components/Heading";
import { PostsList } from "@/components/PostList";
import styles from "./PostList.module.css";

export const PostList: FC = () => {

  return (
    <div className={styles.PostListPage}>
      <Heading as="h1">Список постов</Heading>
      <Heading as="h4">Добавить пагинацию потом</Heading>
      <PostsList />
    </div >
  );
};