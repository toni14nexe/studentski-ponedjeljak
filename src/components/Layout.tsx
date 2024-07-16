import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={inter.className}>
      <header>header</header>
      <main>{children}</main>
      <footer>footer</footer>
    </div>
  );
};

export default Layout;
