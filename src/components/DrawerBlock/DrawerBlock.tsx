import type { FC, ReactNode } from "react";
import Drawer from "@mui/material/Drawer";
import styles from "./DrawerBlock.module.css";
import { Button } from "@components/Button";

interface IDrawerBlockProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  anchor?: "left" | "top" | "bottom" | "right";
  classNameHeader?: string;
  classNameContent?: string;
  closePosition?: "left" | "right";
}

export const DrawerBlock: FC<IDrawerBlockProps> = ({
  children,
  isOpen,
  onClose,
  anchor = "left",
  classNameHeader,
  classNameContent,
  closePosition = "left",
}) => {
  return (
    <Drawer open={isOpen} anchor={anchor} onClose={onClose}>
      <div
        className={`${styles.header} ${closePosition === "left" ? styles.left : styles.right} ${classNameHeader || ""}`}
      >
        <Button variant='danger' size='smallest' onClick={onClose}>
          ×
        </Button>
      </div>
      <div className={`${styles.content} ${classNameContent || ""}`}>{children}</div>
    </Drawer>
  );
};
