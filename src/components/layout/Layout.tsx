
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-beige-100 dark:bg-beige-900 text-foreground min-h-screen transition-colors duration-300">
      <Header />
      <div className="min-h-screen pt-16">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
