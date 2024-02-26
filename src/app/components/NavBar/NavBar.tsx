"use client";
import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { IoClose, IoPersonCircle } from "react-icons/io5";
import { FaCirclePlay } from "react-icons/fa6";
import { INavBar } from "../../constants/types";
import { cn } from "../../lib/cn";
import { key } from "@/app/lib/uniqueKey";
import Button from "@/app/components/Button/Button";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { isLoading, user } from "@/app/store";
import { Icon } from "@tremor/react";
import Image from "next/image";
import { IoIosPower } from "react-icons/io";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { useAuthStateChange } from "@/app/hooks";
import LogOutModal from "@/app/components/Modal/LogOutModal";
import Onboarding from "../Onboarding/Onboarding";

const NavBar: NextPage = () => {
  const [showHamburger, setShowHamburger] = useState<boolean>(true);
  useAuthStateChange();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openOnboarding, setOpenOnboarding] = useState<string>("");
  const loading = useSelector(isLoading);
  const userr = useSelector(user);

  const navBarArr: INavBar[] = [
    {
      id: key(),
      text: "Pricing",
      url: "/",
    },
    {
      id: key(),
      text: "Download",
      url: "/",
    },
    {
      id: key(),
      text: "Integration",
      url: "/",
    },
    {
      id: key(),
      text: "Register",
      callback: () => setOpenOnboarding("signup"),
    },
    {
      id: key(),
      text: "Login",
      callback: () => setOpenOnboarding("signin"),
    },
    {
      id: key(),
      text: "Dashboard",
      url: "/dashboard",
    },
  ];
  const arr =
    userr.name !== ""
      ? navBarArr.filter((_, i) => i !== 3 && i !== 4)
      : navBarArr.slice(0, 5);
  return (
    <header className="h-20 flex w-full flex-row justify-between items-center">
      <div className="flex flex-row items-center" data-testid="logo">
        <FaCirclePlay className="text-tremor-brand-primary text-xl mx-2" />
        <span className=" text-tremor-brand-primary text-xl">Chimoney</span>
      </div>
      {!showHamburger ? (
        <IoClose
          onClick={() => setShowHamburger(true)}
          className="text-2xl text-tremor-text-primary md:hidden cursor-pointer"
        />
      ) : (
        <RxHamburgerMenu
          onClick={() => setShowHamburger(false)}
          className="text-2xl text-tremor-text-primary md:hidden cursor-pointer"
        />
      )}
      <div
        className={cn(
          "hidden md:flex flex-col md:flex-row items-center w-2/3 justify-end",
          {
            hidden: showHamburger,
            "flex bg-white h-screen dark:bg-black py-4 z-50 absolute justify-start top-16 md:relative md:top-0 w-full right-0 md:flex-row md:items-center md:w-2/3 md:justify-end":
              !showHamburger,
          }
        )}
      >
        {arr.map(({ id, text, url, callback }: INavBar) => {
          return (
            <Link
              data-testid="link"
              aria-label="navbar link"
              href={url ?? "#"}
              onClick={callback ?? (() => null)}
              key={id}
              className={cn(
                "px-4 py-3 hover:text-gray-500  text-black dark:invert flex-row text-xs flex justify-center items-center relative ",
                {
                  "text-lg md:text-xs": !showHamburger,
                }
              )}
            >
              {text}
            </Link>
          );
        })}
        {userr?.name !== "" ? (
          <section className="flex flex-row items-center " data-testid="user">
            {loading ? (
              <>
                <SkeletonLoader
                  key={key()}
                  type="block"
                  className="size-[30px] grow"
                  count={1}
                />
                <SkeletonLoader
                  key={key()}
                  type="block"
                  className="h-6 w-[20vw] grow"
                  count={1}
                />
              </>
            ) : (
              <>
                {userr.photo ? (
                  <Image
                    src={userr?.photo}
                    alt="User photo"
                    className="mx-1 bg-gray-300 rounded-full p-[3px]"
                    width={30}
                    height={30}
                    priority
                  />
                ) : (
                  <IoPersonCircle className="size-[30px] text-gray-500 m-1" />
                )}
                <p className="text-xs text-black dark:invert">
                  {userr?.name?.split(" ")[0]}
                </p>
                <Icon
                  icon={IoIosPower}
                  data-testid="logout"
                  className="text-red-400 cursor-pointer"
                  onClick={() => setOpenModal(true)}
                />
              </>
            )}
          </section>
        ) : (
          <Button title="Continue with" />
        )}
      </div>
      <LogOutModal
        open={openModal}
        setOpen={setOpenModal}
        text="Are you sure you want to Signout?"
      />

      <Onboarding open={openOnboarding} setOpen={setOpenOnboarding} />
    </header>
  );
};

export default NavBar;
