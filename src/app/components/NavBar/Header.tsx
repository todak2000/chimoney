"use client";
import { NextPage } from "next";
import React, { useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { key } from "@/app/lib/uniqueKey";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex, tabIndex, user } from "@/app/store";
import { Icon } from "@tremor/react";
import Image from "next/image";
import { IoIosPower } from "react-icons/io";
import { useAccountData } from "@/app/hooks";
import LogOutModal from "@/app/components/Modal/LogOutModal";
import Link from "next/link";
import { cn } from "@/app/lib/cn";
import { IoPersonCircle } from "react-icons/io5";
import CurrencySwitch from "./CurrencySwitch";
const Header: NextPage = () => {
  const dispatch = useDispatch();
  const userr = useSelector(user);
  const tabIndexx = useSelector(tabIndex);
  const [openModal, setOpenModal] = useState<boolean>(false);
  useAccountData();

  const arr = ["Overview", "Transactions"];

  return (
    <header className="h-20 border-b-[1px] p-2 md:px-10 pb-4 md:pt-4 border-b-gray-300 flex w-full flex-row justify-between items-center">
      <Link href={"/"} className="md:w-1/3" data-testid="logo">
        <FaCirclePlay className="text-tremor-brand-primary text-xl" />
      </Link>

      <div className="justify-center flex flex-row md:w-1/3">
        <ul className="flex  -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {arr.map((text: string, index: number) => {
            return (
              <li className="me-2" key={key()}>
                <button
                  onClick={() => {
                    dispatch(setTabIndex(index));
                  }}
                  className={cn({
                    "inline-flex items-center justify-center py-1 px-2 md:px-4 border-transparent rounded-full hover:text-gray-600 hover:border-text-tremor-brand-primary dark:hover:text-gray-300 group text-xs md:text-sm":
                      tabIndexx !== index,
                    "inline-flex items-center justify-center py-1 md:px-4 px-2 rounded-full text-tremor-brand-secondary hover:bg-tremor-brand-secondary hover:text-tremor-brand-primary bg-tremor-brand-primary group text-xs md:text-sm":
                      tabIndexx === index,
                  })}
                >
                  {text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <section className="flex flex-row items-center md:w-1/3 justify-end">
        <span className="md:flex hidden">
          <CurrencySwitch />
        </span>
        <Link
          href="#"
          className={cn(
            "flex flex-row items-center px-2 justify-between py-1 hover:rounded-full hover:bg-gray-200",
            {
              "bg-transparent ": tabIndexx !== 2,
              "bg-tremor-brand-primary rounded-full hover:bg-indigo-400 ":
                tabIndexx === 2,
            }
          )}
          onClick={() => dispatch(setTabIndex(2))}
        >
          {userr?.photo ? (
            <Image
              src={userr?.photo}
              alt="User photo"
              className={cn("mr-1 bg-gray-300 rounded-full p-[3px]", {
                "bg-white p-[0px]": tabIndexx === 2,
                "bg-gray-300 p-[3px]": tabIndexx !== 2,
              })}
              width={30}
              height={30}
              priority
            />
          ) : (
            <IoPersonCircle className="size-[30px] text-gray-500 m-1" />
          )}
          <p
            className={cn("text-xs text-black dark:invert", {
              "text-white dark:invert-0": tabIndexx === 2,
              "text-black": tabIndexx !== 2,
            })}
          >
            {userr?.name?.split(" ")[0]}
          </p>
        </Link>
        <Icon
          icon={IoIosPower}
          data-testid="logout"
          className="text-red-400 dark:text-red-400 cursor-pointer"
          onClick={() => setOpenModal(true)}
        />
      </section>
      <LogOutModal
        open={openModal}
        setOpen={setOpenModal}
        text="Are you sure you want to Signout?"
      />
    </header>
  );
};

export default Header;
