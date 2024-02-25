"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/cn";
import { FaCirclePlay } from "react-icons/fa6";

import { IoClose } from "react-icons/io5";

import OptionList from "@/app/components/Modal/OptionList";
import Form from "@/app/components/Modal/Form";
import {
  useCreatePaymentLink,
  useSendP2P,
  useSendToBank,
  useUserBalance,
} from "@/app/hooks";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
import FinalForm from "@/app/components/Modal/FinalForm";
import { SelectModalProps, finalFormDataProps } from "@/app/constants/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  getBackFunction,
  getFormData,
  getSchema,
  getSubHeader,
} from "@/app/constants/modal";
import { useDispatch, useSelector } from "react-redux";
import { updateBalanceAndAddTransaction, user } from "@/app/store";
import { Dispatch } from "@reduxjs/toolkit";

const SelectModal = ({
  open,
  setOpen,
  type,
  options,
  header,
  next,
  setNext,
  currentExchangeRate,
  subHeader,
}: SelectModalProps) => {
  const queryClient = useQueryClient();
  const [finalResultData, setFinalResultData] =
    useState<finalFormDataProps | null>(null);
  const dispatch = useDispatch();
  const userr = useSelector(user);
  const userBalance = useUserBalance();
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
        email: string;
        data: {
          id: string;
          valueInUSD: number;
          email: string;
          receiver: string;
          redeemLink: string;
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
    type: string,
    dispatch: Dispatch
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
            email: data.data?.data[0]?.email || data.data?.data[0]?.receiver,
            link: data.data?.data[0]?.redeemLink,
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
        };
      }

      setFinalResultData(finalResultData);
      const dynamicAmount =
        userr.prefferedCurrency === "USD"
          ? data.data?.valueInUSD
          : data.data?.valueInUSD / currentExchangeRate();

      const newBalancee =
        (userBalance && userBalance?.chi - dynamicAmount) || 0;
      const txn = {
        amount: dynamicAmount,
        balanceBefore: (userBalance && userBalance?.chi) || 0,
        description: "Payment from .....",

        meta: {
          date: {
            _seconds: Math.floor(Date.now() / 1000),
            _nanoseconds: Date.now() * 1e6,
          },
        },
        newBalance: newBalancee,
        type: "Debit",
        wallet: "chi",
      };

      setNext(`final-${type}`);
      showToastSuccess(
        `Yea! Payment ${type === "link" || type === "card" ? "Link" : ""} was successful. ${type === "card" ? "Please wait while you are redirected. Thanks" : ""}`
      );
      dispatch(
        updateBalanceAndAddTransaction({
          accountId: userr.accountNo as string,
          newBalance: newBalancee,
          transaction: txn,
        })
      );
    } else if ((data && data.status !== "success") || isError) {
      showToastError("Oops! something went wrong");
    }
  };

  useEffect(() => {
    handleResponse(p2pData, p2pError, p2pIsError, "p2p", dispatch);
    handleResponse(p2pData, p2pError, p2pIsError, "email", dispatch);
    handleResponse(linkData, linkError, linkIsError, "link", dispatch);
    handleResponse(linkData, linkError, linkIsError, "card", dispatch);
    handleResponse(bankData, bankError, bankIsError, "bank", dispatch);
  }, [
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
      case "email":
        return p2pIsPending;
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
      case "email":
        return handleP2P;
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
            currentExchangeRate={currentExchangeRate}
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
            currentExchangeRate={currentExchangeRate}
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
