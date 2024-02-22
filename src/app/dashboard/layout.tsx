"use client";

import Header from "@/app/components/NavBar/Header";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import { LayoutType } from "@/app/constants/types";
import { useAuthStateChange } from "@/app/hooks";
import React from "react";

const Layout = ({ children }: LayoutType) => {
  useAuthStateChange();
  return (
    <main className="bg-white  items-start dark:bg-black max-h-screen md:h-[100vh] flex-col flex w-full md:overflow-hidden">
      <ThemeSwitch />
      <Header />
      {children}
    </main>
  );
};

export default Layout;
