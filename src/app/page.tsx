/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { ChimoneyToast } from "./lib/toast";

import { setIsLoading } from "./store";
import NavBar from "@/app/components/NavBar/NavBar";
import ThemeSwitch from "@/app/components/ThemeSwitch";

import Hero from "@/app/components/Hero/Hero";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    ChimoneyToast.dismiss();
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 3000);
  }, []);

  return (
    <main className="bg-white md:px-40 md:pt-10 px-10 items-start dark:bg-black min-h-screen h-[100vh] flex-col flex w-full md:overflow-hidden">
      <ThemeSwitch />
      <NavBar />
      <Hero />
    </main>
  );
}
