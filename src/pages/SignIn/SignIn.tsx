import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from '@/configDb';
import { useStore } from "@/store";
import styles from "./SignIn.module.css";
import { Heading } from "@/components/Heading";
import { PAGES } from "@/contants";

export const SignIn: FC = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      setUser(result.user);
      navigate(PAGES.MAIN.path);
    });
  };

  return (
    <div className={styles.SignIn}>
      <Heading as="h1">Вход</Heading>
      <Heading as="h4">Авторизоваться через Google</Heading>
      <button className={styles.signInGoogle} onClick={signInWithGoogle}>Войти через Google</button>
    </div>
  );
};