import React, { useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import style from "./Layout.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setIsAuthenticated, logout } from "@/store/store";
import { useRouter } from "next/router";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();

  useEffect(() => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    const loginHash = process.env.NEXT_PUBLIC_LOGIN_HASH;

    if (authToken === loginHash) dispatch(setIsAuthenticated(true));
    else cleanCookie();
  }, [dispatch, router]);

  const cleanCookie = () => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  };

  return (
    <div className={style.layoutContainer}>
      <div className={style.inlayoutContainer}>
        <Header />
        <main className={style.mainContainer}>{children}</main>
      </div>
      <div className={style.footerWrapper}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
