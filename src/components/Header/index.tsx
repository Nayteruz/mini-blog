import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { auth, signOut } from "../../configDb";
import { PAGES } from "../../contants";
import styles from "./Header.module.css";

export const Header = () => {
  const { setUser } = useStore();
  const isAuth = useStore((state) => state.getIsAuth());
  const navigate = useNavigate();

  const signOutUser = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/sign-in");
    });
  };

  return (
    <header className={styles.header}>
      <nav className={styles.topNav}>
        <ul>
          <li>
            <Link className={styles.link} to={PAGES.MAIN.path}>{PAGES.MAIN.title}</Link>
          </li>
          {isAuth ? (
            <>
              <li>
                <Link className={styles.link} to={PAGES.CATEGORIES.path}>{PAGES.CATEGORIES.title}</Link>
              </li>
              <li>
                <Link className={styles.link} to={PAGES.POST_LIST.path}>{PAGES.POST_LIST.title}</Link>
              </li>
              <li>
                <Link className={styles.link} to={PAGES.CREATE_NOTE.path}>{PAGES.CREATE_NOTE.title}</Link>
              </li>
              <li>
                <button className={styles.link} onClick={signOutUser}>{PAGES.SIGN_OUT.title}</button>
              </li>
            </>
          ) : (
            <li>
              <Link className={styles.link} to={PAGES.SIGN_IN.path}>{PAGES.SIGN_IN.title}</Link>
            </li>
          )}
        </ul>
      </nav>
    </header >
  );
};