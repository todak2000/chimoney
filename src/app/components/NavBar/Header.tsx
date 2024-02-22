"use client";
import { NextPage } from "next";
import React, { useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { key } from "@/app/lib/uniqueKey";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex, tabIndex, updateCurrency, user } from "@/app/store";
import { Icon, Tab, TabGroup, TabList, Switch } from "@tremor/react";
import Image from "next/image";
import { IoIosPower } from "react-icons/io";
import { useSignOut } from "@/app/hooks";
import LogOutModal from "@/app/components/Modal/LogOutModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/cn";
const Header: NextPage = () => {
  const dispatch = useDispatch();
  const userr = useSelector(user);
  const tabIndexx = useSelector(tabIndex);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const out = useSignOut();
  const arr = ["Overview", "Transactions"];
  const [isSwitchOn, setIsSwitchOn] = React.useState<boolean>(
    userr.prefferedCurrency !== "USD"
  );

  const handleSwitchChange = (value: boolean) => {
    setIsSwitchOn(value);
    dispatch(updateCurrency(value ? "NGN" : "USD"));
  };

  return (
    <header className="h-20 border-b-[1px] px-10 pb-4 md:pt-4 border-b-gray-300 flex w-full flex-row justify-between items-center">
      <Link href={"/"} className="w-1/3">
        <FaCirclePlay className="text-tremor-brand-primary text-xl" />
      </Link>

      <div className="justify-center flex flex-row w-1/3">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {arr.map((text: string, index: number) => {
            return (
              <li className="me-2">
                <a
                  href="#"
                  onClick={() => dispatch(setTabIndex(index))}
                  className={cn({
                    "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group":
                      tabIndexx !== index,
                    "inline-flex items-center justify-center p-4 text-tremor-brand-primary border-b-2 border-tremor-brand-primary rounded-t-lg active dark:text-tremor-brand-primary dark:border-tremor-brand-primary group":
                      tabIndexx === index,
                  })}
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <section className="flex flex-row items-center w-1/3 justify-end">
        <label
          className={cn(
            "hidden md:inline-flex items-center me-5 cursor-pointer",
            {
              "md:hidden": tabIndexx === 1,
            }
          )}
        >
          <span className="mx-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            USD
          </span>
          <Switch
            id="switch"
            name="switch"
            checked={isSwitchOn}
            onChange={handleSwitchChange}
          />
          <span className="mx-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            NGN
          </span>
        </label>
        <Link
          href="#"
          className={cn(
            "flex flex-row items-center px-2 justify-between py-1 hover:rounded-full hover:bg-gray-200",
            {
              "bg-transparent ": tabIndexx !== 2,
              "bg-tremor-brand-primary rounded-full": tabIndexx === 2,
            }
          )}
          onClick={() => dispatch(setTabIndex(2))}
        >
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
          className="text-red-400 dark:text-red-400 cursor-pointer"
          onClick={() => setOpenModal(true)}
        />
      </section>
      <LogOutModal
        open={openModal}
        setOpen={setOpenModal}
        callBack={out}
        text="Are you sure you want to Signout?"
      />
    </header>
  );
};

export default Header;
