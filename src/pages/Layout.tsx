import SideDrawer from "../components/Layout/SideDrawer.tsx";
import Navbar from "../components/Layout/Navbar.tsx";
import { useState } from "react";
import * as React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <div
      data-theme="light"
      className="h-full w-full bg-base-300 flex flex-col "
    >
      <Navbar toggleDrawer={toggleDrawer} />
      <SideDrawer isOpened={drawerOpen}>
        <main className="flex-1 overflow-auto h-full">{children}</main>
      </SideDrawer>
    </div>
  );
};

export default Layout;
