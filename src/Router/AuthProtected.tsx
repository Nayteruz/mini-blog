import { PAGES } from "@/contants";
import { useEffect, useState } from "react";
import { auth } from "@/configDb";
import { Outlet, Navigate } from "react-router-dom";
import { Spinner } from "@/components/Spinner";
import styles from "./AuthProtected.module.css";

export const AuthProtected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);


  if (isAuthenticated === null) {
    return (
      <div className={styles.loader}><Spinner /></div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to={PAGES.SIGN_IN.path} replace />;
  }

  return <Outlet />;
};