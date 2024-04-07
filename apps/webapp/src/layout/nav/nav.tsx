import React from "react";
import { Sidebar } from "./sidebar/sidebar";
import { BottomBar } from "./bottom-bar";
import { TopBar } from "./top-bar";

export const NavBar = () => {
  return (
    <>
      <TopBar />
      <Sidebar />
      <BottomBar />
    </>
  );
};
