import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { auth, signOut } from "@/configDb";
import { DEFAULT_TOP_MENU, PAGES, USER_TOP_MENU } from "@/contants";
import { Button } from "@components/Button";
import MenuIcon from "@assets/icons/barsIcon.svg?react";
import styles from "./Header.module.css";


export const Header = () => {
  const { setUser } = useStore();
  const isAuth = useStore((state) => state.getIsAuth());
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const signOutUser = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      setUser(null);
      navigate(PAGES.SIGN_IN.path);
    });
  };

  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const navList = isAuth ? USER_TOP_MENU : DEFAULT_TOP_MENU;

  return (
    <header className={styles.header}>
      <nav className={styles.topNav}>
        <ul className={isOpen ? styles.open : ''} onClick={closeMenu}>
          {navList.map((item) => (
            <li key={item.path}>
              <Link className={`${styles.link} ${location.pathname === item.path && styles.active}`} to={item.path}>{item.label}</Link>
            </li>
          ))}
          {isAuth && <li>
            <button className={styles.link} onClick={signOutUser}>{PAGES.SIGN_OUT.title}</button>
          </li>}
        </ul>
        <Button variant="purple" className={styles.burger} onClick={() => setIsOpen((prev) => !prev)}><MenuIcon /></Button>
      </nav>
    </header >
  );
};