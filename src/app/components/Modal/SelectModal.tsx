"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/cn";
import { FaCirclePlay } from "react-icons/fa6";

import { IoClose } from "react-icons/io5";

import OptionList from "@/app/components/Modal/OptionList";
import Form from "@/app/components/Modal/Form";
import {
  useCreatePaymentLink,
  useSendByEmail,
  useSendP2P,
  useSendToBank,
  useUserBalance,
} from "@/app/hooks";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
import FinalForm from "@/app/components/Modal/FinalForm";
import {
  AccProps,
  SelectModalProps,
  finalFormDataProps,
} from "@/app/constants/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  getBackFunction,
  getFormData,
  getSchema,
  getSubHeader,
} from "@/app/constants/modal";

const SelectModal = ({
  open,
  setOpen,
  type,
  options,
  header,
  next,
  setNext,
  subHeader,
  accountData,
}: SelectModalProps) => {
  const queryClient = useQueryClient();
  const [finalResultData, setFinalResultData] =
    useState<finalFormDataProps | null>(null);

  const userBalance = useUserBalance(accountData as AccProps[]);
  const {
    handlePaymentLink,
    isPending: linkIsPending,
    isError: linkIsError,
    data: linkData,
    error: linkError,
  } = useCreatePaymentLink();
  const {
    handleSendToBank,
    isPending: bankIsPending,
    isError: bankIsError,
    data: bankData,
    error: bankError,
  } = useSendToBank();
  const {
    handleSendByEmail,
    isPending: emailPending,
    isError: emailIsError,
    data: emailData,
    error: emailError,
  } = useSendByEmail();
  const {
    handleP2P,
    isPending: p2pIsPending,
    isError: p2pIsError,
    data: p2pData,
    error: p2pError,
  } = useSendP2P();

  const handleClose = () => {
    setOpen("");
    setNext("");
  };

  const handleResponse = (
    data: {
      status: string;
      data: {
        id: string;
        valueInUSD: number;
        data: {
          id: string;
          valueInUSD: number;
        }[];
        chiRef: string;
        payerEmail: string;
        paymentLink: string;
        status: string;
        paymentRef: string;
      };
    },
    error: Error | null,
    isError: boolean,
    type: string
  ) => {
    if (data && data.status === "success" && next === type) {
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      let finalResultData: finalFormDataProps = data.data.id
        ? {
            paymentId: data.data?.id,
            amount: data.data?.valueInUSD,
          }
        : {
            paymentId: data.data.data[0]?.id,
            amount: data.data.data[0]?.valueInUSD,
          };

      if (type === "card") {
        window.location.href = data.data.paymentLink;
      }
      if (type === "link") {
        finalResultData = {
          ...finalResultData,
          chiRef: data.data.chiRef,
          payee: data.data.payerEmail,
          paymentLink: data.data.paymentLink,
          paymentStatus: data.data.status,
          paymentRef: data.data.paymentRef,
        };
      }

      setFinalResultData(finalResultData);
      setNext(`final-${type}`);
      showToastSuccess(
        `Yea! Payment ${type === "link" || type === "card" ? "Link" : ""} was successful. ${type === "card" ? "Please wait while you are redirected. Thanks" : ""}`
      );
    } else if ((data && data.status !== "success") || isError) {
      showToastError("Oops! something went wrong");
    }
  };

  useEffect(() => {
    handleResponse(emailData, emailError, emailIsError, "email");
    handleResponse(p2pData, p2pError, p2pIsError, "p2p");

    handleResponse(linkData, linkError, linkIsError, "link");
    handleResponse(linkData, linkError, linkIsError, "card");
    handleResponse(bankData, bankError, bankIsError, "bank");
  }, [
    emailData,
    emailError,
    emailIsError,
    p2pData,
    p2pError,
    p2pIsError,
    linkData,
    linkError,
    linkIsError,
    bankIsError,
    bankData,
    bankError,
  ]);

  const getLoadingStatus = (next: string) => {
    switch (next) {
      case "p2p":
        return p2pIsPending;
      case "email":
        return emailPending;
      case "link":
      case "card":
        return linkIsPending;
      case "bank":
        return bankIsPending;
      default:
        return false;
    }
  };

  const getSubmitFunction = (next: string) => {
    switch (next) {
      case "p2p":
        return handleP2P;
      case "email":
        return handleSendByEmail;
      case "link":
      case "card":
        return handlePaymentLink;
      case "bank":
        return handleSendToBank;
      default:
        return () => {};
    }
  };

  const renderForm = (next: string) => {
    switch (next) {
      case "":
        return <OptionList options={options} subHeader={subHeader} />;
      case "link":
      case "card":
      case "p2p":
      case "email":
      case "bank":
        return (
          <Form
            data={getFormData(next)}
            userBalance={userBalance}
            subHeader={getSubHeader(next)}
            backFn={() => setNext("")}
            schema={getSchema(next)}
            loading={getLoadingStatus(next)}
            submitFn={getSubmitFunction(next)}
          />
        );
      case "final-link":
      case "final-p2p":
      case "final-email":
      case "final-bank":
        return (
          <FinalForm
            data={finalResultData as finalFormDataProps}
            subHeader={
              next === "final-link" ? "Payment Link" : "Payment Successful"
            }
            backFn={getBackFunction(next, setNext)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="crypto-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={cn(
        "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-300 opacity-100",
        {
          hidden: open !== type,
          flex: open === type,
        }
      )}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex flex-row items-center justify-center py-4">
            <FaCirclePlay className="text-tremor-brand-primary text-xl mx-2" />
            <span className=" text-tremor-brand-primary text-xl">Chimoney</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white absolute right-4 top-4"
            data-modal-toggle="crypto-modal"
          >
            <IoClose className="text-gray-400 text-sm" />
            <span className="sr-only">Close modal</span>
          </button>
          {next === "" && (
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {header}
              </h3>
            </div>
          )}
          {renderForm(next)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SelectModal);
