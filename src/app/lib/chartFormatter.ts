import {
  AccProps,
  ChartResultProps,
  TransactionsProps,
} from "@/app/constants/types";
import { formatedDatePast } from "@/app/lib/date.";
import { faker } from "@faker-js/faker";
import moment from "moment";

export const transformData = (accounts: AccProps[]) => {
  let results: ChartResultProps[] = [];
  let transactionResults: TransactionsProps[] = [];

  accounts?.forEach((account) => {
    account.transactions.forEach((transaction: TransactionsProps) => {
      const date = moment
        .unix(transaction?.meta?.date?._seconds as number)
        .format("MMM DD YYYY");
      const dateTime = moment
        .unix(transaction?.meta?.date?._seconds as number)
        .format("YYYY-MM-DD HH:mm:ss");
      const balanceKey = account.type.toLocaleUpperCase();

      let existingEntry: any = results.find((result) => result?.date === date);

      if (existingEntry) {
        existingEntry[balanceKey] = transaction.newBalance;
      } else {
        existingEntry = {
          date,
          [balanceKey]: transaction.newBalance,
        };
        results.push(existingEntry);
      }
      transactionResults.push({
        description: transaction.description,
        date: dateTime,
        amount: Math.abs(transaction.amount),
        type:
          transaction?.newBalance &&
          transaction?.balanceBefore &&
          transaction?.newBalance >= transaction?.balanceBefore
            ? "Credit"
            : "Debit",
        wallet: balanceKey,
      });
    });
  });

  transactionResults.sort(
    (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
  );

  return { chatData: results, transactionData: transactionResults };
};

export const transformDataNGN = (
  accounts: AccProps[],
  currentExchangeRate: () => number
) => {
  let results: ChartResultProps[] = [];
  let transactionResults: TransactionsProps[] = [];

  accounts?.forEach((account) => {
    account.transactions.forEach((transaction: TransactionsProps) => {
      const date = moment
        .unix(transaction?.meta?.date?._seconds as number)
        .format("MMM DD YYYY");
      const dateTime = moment
        .unix(transaction?.meta?.date?._seconds as number)
        .format("YYYY-MM-DD HH:mm:ss");
      const balanceKey = account.type.toLocaleUpperCase();
      const newBalance =
        transaction &&
        transaction.newBalance !== undefined &&
        transaction.newBalance * currentExchangeRate();

      let existingEntry: any = results.find((result) => result?.date === date);

      if (existingEntry) {
        existingEntry[balanceKey] = newBalance;
      } else {
        existingEntry = {
          date,
          [balanceKey]: newBalance,
        };
        results.push(existingEntry);
      }
      transactionResults.push({
        description: transaction.description,
        date: dateTime,
        amount:
          transaction && transaction.amount !== undefined
            ? Math.abs(transaction.amount) * currentExchangeRate()
            : 0,
        type:
          transaction?.newBalance &&
          transaction?.balanceBefore &&
          transaction?.newBalance >= transaction?.balanceBefore
            ? "Credit"
            : "Debit",
        wallet: balanceKey,
      });
    });
  });
  transactionResults.sort(
    (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
  );
  return { chatData: results, transactionData: transactionResults };
};

export const generateChartData = (count: number) => {
  const data: any[] = [];
  for (let i: number = 0; i < count; i += 1) {
    data.push({
      AIRTIME: 0,
      CHI: 0,
      MOMO: 0,
      date: formatedDatePast(),
    });
  }
  return data;
};
