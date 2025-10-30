import { AccordeonList } from "@/components/Category";
import type { FC } from "react";

export const Home: FC = () => {

  return (
    <div className="home-page">
      <AccordeonList title="Категории с постами" />
    </div>
  );
};