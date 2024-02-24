/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { accountDataa, tabIndex, user } from "@/app/store";
import { Flex } from "@tremor/react";
import Overview from "@/app/components/Overview/Overview";
import { useAccountData, useCurrentExchangeRate } from "@/app/hooks";
import { transformData, transformDataNGN } from "@/app/lib/chartFormatter";
import TransactionTable from "@/app/components/Table/TransactionTable";
import Profile from "@/app/components/Profile/Profile";

export default function Home() {
  const tabIndexx = useSelector(tabIndex);
  const userr = useSelector(user);
  const accountData = useSelector(accountDataa);

  const { isPending } = useAccountData();

  const currentExchangeRate = useCurrentExchangeRate();

  const TransforChartData = useMemo(
    () => transformData(accountData),
    [accountData, currentExchangeRate]
  );
  const TransforChartDataNGN = useMemo(
    () => transformDataNGN(accountData, currentExchangeRate),
    [accountData, currentExchangeRate]
  );
  return (
    <main className="bg-white py-2 items-start dark:bg-black min-h-screen h-[100vh] flex-col flex w-full md:overflow-hidden">
      {tabIndexx === 0 && (
        <Flex>
          <Overview
            isPending={isPending}
            accountData={accountData}
            chatData={
              userr.prefferedCurrency === "USD"
                ? TransforChartData?.chatData
                : TransforChartDataNGN.chatData
            }
            currentExchangeRate={currentExchangeRate}
          />
        </Flex>
      )}{" "}
      {tabIndexx === 1 && (
        <section className="w-full  py-10 md:px-20 px-2">
          <TransactionTable
            transactionData={
              userr.prefferedCurrency === "USD"
                ? TransforChartData?.transactionData
                : TransforChartDataNGN?.transactionData
            }
            isPending={isPending}
          />
        </section>
      )}
      {tabIndexx === 2 && (
        <section className="w-full  py-10 md:px-20 px-2 flex flex-row items-center justify-center">
          <Profile />
        </section>
      )}
    </main>
  );
}
