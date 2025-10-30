import { auth, provider, signInWithPopup } from '../configDb';
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      setUser(result.user);
      navigate("/");
    });
  };

  return (
    <div className="signin-page">
      <p>Авторизоваться через Google</p>
      <button className="sign-in-google" onClick={signInWithGoogle}>Войти через Google</button>
    </div>
  );
};