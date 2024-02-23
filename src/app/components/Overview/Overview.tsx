"use client";

import React, { ReactElement, useState } from "react";
import { key } from "@/app/lib/uniqueKey";
import { IoIosAdd } from "react-icons/io";

import { GiCash, GiTakeMyMoney } from "react-icons/gi";

import { Card, Flex, Icon } from "@tremor/react";
import { MdArrowOutward } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
import ButtonSquare from "@/app/components/Button/ButtonSquare";
import { currencyFormater, dateFormater } from "@/app/lib/currencyFormater";
import AccountTrend from "@/app/components/AreaChart/AccountTrend";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { TrendDownIcon, TrendUpIcon } from "@/app/constants/images";
import Image from "next/image";
import { useSelector } from "react-redux";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import {
  AccProps,
  ButtArrProps,
  ModalType,
  OverviewProps,
} from "@/app/constants/types";
import { user } from "@/app/store";
import { cn } from "@/app/lib/cn";

const Overview = ({
  accountData,
  isPending,
  chatData,
  currentExchangeRate,
}: OverviewProps) => {
  const [openModal, setOpenModal] = useState<ModalType>("");
  const [next, setNext] = useState<string>("");
  const userr = useSelector(user);

  const accountTypes: any = {
    chi: {
      name: "Chi Balance",
      icon: TbPigMoney,
      color: "cyan",
    },
    momo: {
      name: "MoMo",
      icon: GiTakeMyMoney,
    },
    airtime: {
      name: "Airtime",
      icon: GiCash,
      color: "rose",
    },
  };
  const buttonArr: ButtArrProps[] = [
    {
      id: key(),
      title: "Add Money",
      icon: (
        <Icon
          icon={IoIosAdd}
          className="text-white hover:text-tremor-brand-primary dark:text-white text-sm"
        />
      ),
      onClick: () => setOpenModal("credit"),
      loading: false,
      className:
        "hover:bg-transparent hover:text-tremor-brand-primary bg-tremor-brand-primary dark:text-white text-white",
    },
    {
      id: key(),
      title: "Send Money",
      icon: (
        <Icon
          icon={MdArrowOutward}
          className="text-black text-sm dark:text-white hover:text-white"
        />
      ),
      onClick: () => setOpenModal("debit"),
      loading: false,
      className:
        "bg-transparent hover:bg-tremor-brand-primary hover:border-transparent hover:text-white text-black border-[1px] dark:border-[0.27px] dark:text-white border-[#E9EBF2]",
    },
  ];

  return (
    <section className=" overflow-y-auto h-[95vh] p-2 sm:p-10 flex flex-col  items-center w-full">
      <Flex className="flex md:flex-row flex-col-reverse">
        <div className="space-y-2 dark:invert  w-full md:w-auto">
          <p className="text-gray-600 font-thin">
            Balance{" "}
            <span className="text-black font-thin ml-3 text-xs">
              Today, {dateFormater()}
            </span>
          </p>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            {isPending || !accountData || accountData?.length <= 0
              ? [1, 2, 3].map(() => {
                  return (
                    <SkeletonLoader
                      key={key()}
                      type="block"
                      className="md:w-[10rem] lg:w-[12rem] h-24 grow"
                      count={1}
                    />
                  );
                })
              : accountData &&
                accountData?.length > 0 &&
                !isPending &&
                accountData?.map((acc: AccProps) => {
                  const lastTransaction =
                    acc?.transactions?.[acc?.transactions?.length - 1];
                  const trendIsUp: boolean =
                    (lastTransaction?.newBalance &&
                      lastTransaction?.balanceBefore &&
                      lastTransaction?.newBalance >=
                        lastTransaction?.balanceBefore) ||
                    false;
                  const accName: string = accountTypes[acc?.type]?.name;
                  const accIcon: ReactElement = (
                    <Icon
                      variant="shadow"
                      tooltip={accName}
                      size="md"
                      icon={accountTypes[acc?.type]?.icon}
                      className={cn(" dark:text-white text-2xl ", {
                        "text-indigo-500 ":
                          accountTypes[acc?.type]?.color === "indigo",
                        "text-cyan-500":
                          accountTypes[acc?.type]?.color === "cyan",
                        "text-rose-500":
                          accountTypes[acc?.type]?.color === "rose",
                      })}
                    />
                  );

                  return (
                    <Card
                      key={key()}
                      className="mx-auto  max-w-xl dark:invert space-y-2"
                    >
                      <span className="flex flex-row items-center space-x-2">
                        <span>{accIcon}</span>
                        <p className="capitalize text-tremor-content dark:text-dark-tremor-content text-xs ">
                          {accName}
                        </p>
                        <Image
                          src={trendIsUp ? TrendUpIcon : TrendDownIcon}
                          alt="TrendDownIcon"
                          className="mx-1 rounded-full p-[3px]"
                          width={30}
                          height={30}
                          priority
                        />
                      </span>

                      <p className="text-xl md:text-lg xl:text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                        {userr.prefferedCurrency === "USD"
                          ? currencyFormater(
                              acc.balance,
                              userr.prefferedCurrency
                            )
                          : currencyFormater(
                              acc.balance * currentExchangeRate(),
                              userr.prefferedCurrency
                            )}
                      </p>
                    </Card>
                  );
                })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {isPending || !accountData || accountData?.length <= 0
            ? [1, 2].map(() => {
                return (
                  <SkeletonLoader
                    key={key()}
                    type="block"
                    className="max-w-[10rem] min-w-[6rem] h-10 grow dark:invert hidden md:flex"
                    count={1}
                  />
                );
              })
            : buttonArr.map(
                ({
                  id,
                  title,
                  icon,
                  loading,
                  onClick,
                  className,
                }: ButtArrProps) => {
                  return (
                    <ButtonSquare
                      key={id}
                      title={title}
                      icon={icon}
                      loading={loading}
                      onClick={onClick}
                      className={className}
                    />
                  );
                }
              )}
        </div>
      </Flex>
      {isPending || !accountData || accountData?.length <= 0 ? (
        <div className="w-full">
          <SkeletonLoader
            key={key()}
            type="block"
            className="w-full sm:mt-10 sm:h-72 h-40 grow dark:invert md:flex"
            count={1}
          />
        </div>
      ) : (
        <AccountTrend data={chatData} />
      )}
      <ModalWrapper
        openModal={openModal}
        setOpenModal={setOpenModal}
        next={next}
        currentExchangeRate={currentExchangeRate}
        setNext={setNext}
        accountData={accountData}
      />
    </section>
  );
};

export default Overview;
