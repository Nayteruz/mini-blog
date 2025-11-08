import { AccordeonList } from "@/components/Category";
import type { FC } from "react";
import styles from "./Home.module.css";
import { Heading } from "@/components/Heading";

export const Home: FC = () => {
  return (
    <div className={styles.HomePage}>
      <Heading as='h1'>Категории с постами</Heading>
      <AccordeonList />
    </div>
  );
};
