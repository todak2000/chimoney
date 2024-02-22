import { SelectInputProps } from "@/app/constants/types";
import { BankSchema, LinkSchema, SendSchema } from "@/app/constants/validation";
import { cn } from "@/app/lib/cn";
import { currencyFormatter } from "@/app/lib/currencyFormater";
import { faker } from "@faker-js/faker";
import { FieldProps } from "formik";
import React from "react";

export const releaseText = "Soon to be released!";
export const countryData = [
  {
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
  },
  {
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
  },
  {
    name: "United States of America",
    code: "US",
    flag: "🇺🇸",
  },
];

export const generateFullName = () => {
  return faker.person.fullName();
};

export const getBackFunction = (
  next: string,
  setNext: React.Dispatch<React.SetStateAction<string>>
) => {
  switch (next) {
    case "final-link":
      return () => setNext("link");
    case "final-card":
      return () => null;
    case "final-email":
      return () => setNext("email");
    case "final-p2p":
      return () => setNext("p2p");
    case "final-bank":
      return () => setNext("bank");
    default:
      return () => {};
  }
};

export const getSchema = (next: string) => {
  switch (next) {
    case "link":
    case "email":
    case "card":
      return LinkSchema;
    case "p2p":
      return SendSchema;
    case "bank":
      return BankSchema;
    default:
      return {};
  }
};

export const getSubHeader = (next: string) => {
  switch (next) {
    case "link":
      return "Create Payment Link";
    case "p2p":
      return "Send Fund via Wallet";
    case "email":
      return "Send Fund via Email";
    case "card":
      return "Fund your Wallet with your Debit/Credit Card";
    case "bank":
      return "Send Fund to Bank";
    default:
      return "";
  }
};

export const getFormData = (next: string) => {
  switch (next) {
    case "link":
    case "email":
    case "card":
      return [
        {
          email: "",
        },
        {
          amount: "",
        },
      ];
    case "p2p":
      return [
        {
          receiverID: "",
        },
        {
          name: "",
        },
        {
          email: "",
        },
        {
          amount: "",
        },
      ];

    case "bank":
      return [
        {
          country: "",
        },
        {
          bank: "",
        },
        {
          accountNumber: "",
        },
        {
          fullname: generateFullName(),
        },
        {
          amount: "",
        },
        {
          branchCode: "",
        },
      ];
    default:
      return [];
  }
};

export const isSendFundViaWallet = (text: string) => {
  return text === "Send Fund via Wallet";
};
export const isReceiverID = (text: string) => {
  return text === "receiverID";
};

export const isEmailOrName = (text: string) => {
  return text === "email" || text === "name";
};
export const isFullnameAndNG = (text: string, text2: string) => {
  return text === "fullname" && text2 === "Nigeria";
};

export const valueToUse = (
  key: string,
  email: string,
  subHeader: string,
  name: string,
  formValue: string | number
) => {
  return isEmailOrName(key) && email !== "" && isSendFundViaWallet(subHeader)
    ? email
    : isEmailOrName(key) && name !== "" && isSendFundViaWallet(subHeader)
      ? name
      : formValue;
};

export const showBranchCodeComponent = (key: string, countryValue: string) => {
  return (
    key === "branchCode" && (countryValue === "" || countryValue === "Nigeria")
  );
};
export const showFullNameComponent = (
  key: string,
  accountNumberValue: string
) => {
  return key === "fullname" && accountNumberValue.length <= 9;
};
export const showFullNameComponentNG = (
  key: string,
  accountNumberValue: string,
  countryValue: string
) => {
  return (
    key === "fullname" &&
    accountNumberValue.length === 10 &&
    countryValue === "Nigeria"
  );
};

export const isFormLoading = (
  walletPending: boolean,
  banksPending: boolean,
  branchPending: boolean,
  namePending: boolean,
  subHeader: string,
  idValue: string
) => {
  return (
    (walletPending && subHeader === "Send Fund via Wallet" && idValue !== "") ||
    (banksPending && subHeader === "Send Fund to Bank") ||
    (branchPending && subHeader === "Send Fund to Bank") ||
    (namePending && subHeader === "Send Fund to Bank")
  );
};
export const maxLengthToUse = (key: string, countryValue: string) => {
  return isReceiverID(key)
    ? 36
    : key === "accountNumber" && countryValue === "Nigeria"
      ? 10
      : null;
};

export const optionsToUse = (
  key: string,
  branches: object[],
  banks: object[]
) => {
  return key === "country"
    ? countryData
    : key === "branchCode"
      ? branches
      : banks;
};

export const onSelectToUse = (
  key: string,
  getBanksDetailsFn: (code: string) => void,
  getBranchCodesFn: (code: string) => void
) => {
  return key === "country"
    ? getBanksDetailsFn
    : key === "bank"
      ? getBranchCodesFn
      : () => null;
};

export const componentToUse = (
  key: string,
  CurrencyComponent: ({ field, form }: FieldProps) => React.JSX.Element,
  SelectComponent: ({
    field,
    form,
    options,
    onSelect,
  }: SelectInputProps) => React.JSX.Element
) => {
  return key === "amount"
    ? CurrencyComponent
    : key === "country" || key === "bank" || key === "branchCode"
      ? SelectComponent
      : null;
};

export const classNameToUse = (key: string, subHeader: string) => {
  return cn(
    "relative  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
    {
      "bg-tremor-brand-secondary":
        isEmailOrName(key) && isSendFundViaWallet(subHeader),
      "bg-gray-50": !(isEmailOrName(key) && isSendFundViaWallet(subHeader)),
    }
  );
};

export const recipientName = (name: string, emailValue: string) => {
  return name?.split(" ")[0] || emailValue?.split("@")[0];
};
export const formattedAmount = (amountValue: number) => {
  return currencyFormatter.format(amountValue);
};

export const SendFundMessage = ({
  amountValue,
  name,
  emailValue,
}: {
  amountValue: string;
  name: string;
  emailValue: string;
}) => {
  return (
    <>
      Send{" "}
      {amountValue === "" ? (
        "Fund"
      ) : (
        <>
          <span className="inline-flex items-center justify-center px-4 py-2 ms-2 mr-2 text-xs font-semibold text-tremor-brand-primary bg-blue-200 rounded-full">
            {formattedAmount(Number(amountValue))}
          </span>{" "}
          to {recipientName(name, emailValue)}
        </>
      )}
    </>
  );
};
