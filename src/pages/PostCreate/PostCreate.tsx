import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/configDb";
import { PostCreateForm } from "@components/Post";
import { Heading } from "@/components/Heading";
import styles from "./styles.module.css";

export const PostCreate: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/sign-in");
    }
  }, [navigate]);

  return (
    <div className={styles.PostCreatePage}>
      <Heading as="h1">Создать новый пост</Heading>
      <PostCreateForm />
    </div >
  );
};