import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { auth, signOut } from "../firebase";

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
    <header className="header">
      <nav className="top-nav">
        <ul>
          <li>
            <Link className="link" to="/">Главная</Link>
          </li>
          {isAuth ? (
            <>
              <li>
                <Link className="link" to="/create-post">Добавить заметку</Link>
              </li>
              <li>
                <button className="link" onClick={signOutUser}>Выйти</button>
              </li>
            </>
          ) : (
            <li>
              <Link className="link" to="/sign-in">Авторизоваться</Link>
            </li>
          )}
        </ul>
      </nav>
    </header >
  );
};