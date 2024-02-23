/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { key } from "@/app/lib/uniqueKey";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
  Flex,
  Select,
  SelectItem,
} from "@tremor/react";
import { FaCirclePlay } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import React, { useState } from "react";
import { cn } from "../../lib/cn";
import { currencyFormater } from "../../lib/currencyFormater";
import { useSelector } from "react-redux";
import SkeletonLoader from "../SkeletonLoader";
import { TransactionViewProps, TransactionsProps } from "@/app/constants/types";
import { user } from "@/app/store";
import Pagination from "./Pagination";
const TransactionTable = ({
  transactionData,
  isPending: loading,
}: TransactionViewProps) => {
  const title = "Latest Transactions";
  const options = ["CHI", "MOMO", "AIRTIME", "Debit", "Credit", "All"];
  const [value, setValue] = useState("");
  const [data, setData] = useState<TransactionsProps[]>([]);

  const userr = useSelector(user);
  return (
    <>
      <span className="flex flex-row items-center justify-between">
        {loading ? (
          ["h-6 w-[100px] grow", "h-6 w-[100px] grow"].map((i: string) => {
            return (
              <SkeletonLoader
                key={key()}
                type="block"
                className={i}
                count={1}
              />
            );
          })
        ) : (
          <Flex>
            <Title
              data-testid="order-title"
              className="text-sm md:bold-xl text-tremor-text-primary dark:invert-0"
            >
              {title}
            </Title>
            <div className="max-w-xs">
              <Select
                id="walletType"
                value={value}
                onValueChange={setValue}
                className=""
              >
                {options.map((item: string) => {
                  return (
                    <SelectItem key={key()} value={item} icon={FaCirclePlay}>
                      {item}
                    </SelectItem>
                  );
                })}
              </Select>
            </div>
          </Flex>
        )}
      </span>
      <Pagination
        data={transactionData}
        itemsPerPage={10}
        currentData={data}
        setCurrentData={setData}
        value={value}
      />
      <Table
        data-testid="order-table"
        className="mt-5 overflow-y-auto max-h-[80vh] pb-[20vh] no-scrollbar"
      >
        {loading ? (
          [...Array(6)].map((_) => {
            return (
              <SkeletonLoader
                key={key()}
                type="block"
                className="h-8 w-full my-1 grow"
                count={1}
              />
            );
          })
        ) : (
          <>
            <TableHead>
              <TableRow className="medium-lg text-tremor-brand-secondary">
                {[
                  "Date",
                  "Amount",
                  "Description",
                  "Type",
                  "Wallet",
                  "Details",
                ].map((i: string) => {
                  return (
                    <TableHeaderCell
                      key={key()}
                      data-testid="order-table-header"
                    >
                      {i}
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionData &&
                transactionData?.length > 0 &&
                data?.map(({ description, date, amount, type, wallet }) => (
                  <TableRow
                    key={key()}
                    data-testid="order-table-row"
                    className="hover:bg-gray-200"
                  >
                    <TableCell className="flex flex-row items-center medium-lg text-[#3A3F51] dark:invert">
                      <Text>{date}</Text>
                    </TableCell>
                    <TableCell className="regular-lg text-[#737373]">
                      <Text>
                        {currencyFormater(amount, userr.prefferedCurrency)}
                      </Text>
                    </TableCell>
                    <TableCell className="text-sm text-tremor-brand-hover">
                      {description.length > 20
                        ? `${description.substring(0, 20)}..`
                        : description}
                    </TableCell>
                    <TableCell
                      className={cn({
                        "regular-lg text-green-500": type === "Credit",
                        "regular-lg text-tremor-brand-tertiary":
                          type === "Debit",
                      })}
                    >
                      {type}
                    </TableCell>
                    <TableCell className="regular-lg text-[#737373]">
                      <Text> {wallet}</Text>
                    </TableCell>
                    <TableCell className="regular-md  text-tremor-brand-hover dark:invert">
                      <span className="flex flex-row items-center cursor-pointer">
                        <IoDocumentText className="mx-1  size-4" />
                        <Text>{`View`}</Text>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </>
        )}
      </Table>
    </>
  );
};

export default TransactionTable;
