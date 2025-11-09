import { useState } from "react";
import { useStore } from "@/store";
import { DEFAULT_TOP_MENU, USER_TOP_MENU } from "@/contants";
import { Button } from "@/components/Button";
import MenuIcon from "@assets/icons/barsIcon.svg?react";
import styles from "./Header.module.css";
import { DrawerBlock } from "../DrawerBlock";
import type { IMenuItem } from "./types";
import { MenuHeader } from "./MenuHeader";

export const Header = () => {
  const isAuth = useStore(state => state.getIsAuth());
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const navList: IMenuItem[] = isAuth ? USER_TOP_MENU : DEFAULT_TOP_MENU;

  return (
    <header className={styles.Header}>
      <DrawerBlock isOpen={isOpen} onClose={closeMenu} anchor='right'>
        <MenuHeader list={navList} />
      </DrawerBlock>
      <MenuHeader list={navList} />
      <Button variant='purple' className={styles.burger} onClick={() => setIsOpen(prev => !prev)}>
        <MenuIcon />
      </Button>
    </header>
  );
};
