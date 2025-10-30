import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/configDb";
import { PostEditForm } from "@components/Post";
import { Heading } from "@/components/Heading/Heading";
import styles from "./styles.module.css";

export const PostEdit = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/sign-in");
    }
  }, [navigate]);

  return (
    <div className={styles.PostEditPage}>
      <Heading as="h1">Редактировать пост</Heading>
      <PostEditForm />
    </div >
  );
};