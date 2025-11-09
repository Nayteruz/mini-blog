import type { FC } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { PAGES } from "@/contants";
import type { IMenuItem } from "./types";
import { auth, signOut } from "@/configDb";
import { useStore } from "@/store";
import { Button } from "../Button";

interface IHeaderMenuProps {
  list: IMenuItem[];
}

export const MenuHeader: FC<IHeaderMenuProps> = ({ list = [] }) => {
  const { setUser } = useStore();
  const isAuth = useStore(state => state.getIsAuth());
  const navigate = useNavigate();
  const signOutUser = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      setUser(null);
      navigate(PAGES.SIGN_IN.path);
    });
  };

  return (
    <nav className={styles.MenuHeader}>
      <ul>
        {list.map(item => (
          <li key={item.path}>
            <Link className={`${styles.link} ${location.pathname === item.path && styles.active}`} to={item.path}>
              {item.label}
            </Link>
          </li>
        ))}
        {isAuth && (
          <li>
            <Button variant='danger' className={styles.linkOut} onClick={signOutUser}>
              {PAGES.SIGN_OUT.title}
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
};
