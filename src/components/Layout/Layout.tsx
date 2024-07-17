import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import style from "./Layout.module.scss";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
