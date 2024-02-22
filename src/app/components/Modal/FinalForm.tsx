import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiTwotoneCopy } from "react-icons/ai";

import { currencyFormatter } from "@/app/lib/currencyFormater";
import { FinalModalProps } from "@/app/constants/types";
import { copyToClipboard } from "@/app/lib/others";

const FinalModalForm = ({ data, subHeader, backFn }: FinalModalProps) => {
  return (
    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <div className=" flex  flex-row justify-start items-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <button
          type="button"
          onClick={backFn}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white mr-3"
          data-modal-toggle="crud-modal"
        >
          <IoIosArrowRoundBack className="text-gray-800 text-xl dark:invert " />
          <span className="sr-only">Back</span>
        </button>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {subHeader}
        </h3>
      </div>
      {subHeader === "Payment Successful" ? (
        <div className="p-4 md:p-5 text-center space-y-3">
          <span className="text-[100px]">💰</span>
          <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
            You have successfully paid
          </h3>

          <h3 className="text-gray-900 font-bold dark:text-white">
            {currencyFormatter.format(data?.amount || 0)}
          </h3>
          {Object?.entries(data as object)?.length > 0 &&
            Object?.entries(data as object)
              ?.filter(([key, value]) => key !== "amount")
              .map(([key, value]) => (
                <div key={key} className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <div className="flex">
                      <span
                        className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 cursor-pointer rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                        onClick={() => copyToClipboard(key, value)}
                      >
                        <span> Payment ID</span>
                        <AiTwotoneCopy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </span>
                      <input
                        type="text"
                        id={key}
                        disabled
                        name={key}
                        value={value}
                        className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-tremor-brand-primary focus:border-tremor-brand-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary"
                        placeholder={key}
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      ) : (
        <div className="p-4 md:p-5">
          {Object.entries(data as object).length > 0 &&
            Object.entries(data as object).map(([key, value]) => (
              <div key={key} className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor={key}
                    className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {key}
                  </label>
                  <div className="flex">
                    <span
                      className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 cursor-pointer rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                      onClick={() => copyToClipboard(key, value)}
                    >
                      <AiTwotoneCopy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id={key}
                      disabled
                      name={key}
                      value={
                        key === "amount"
                          ? currencyFormatter.format(value)
                          : value
                      }
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="elonmusk"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FinalModalForm);
