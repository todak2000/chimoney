import { releaseText } from "@/app/constants/modal";
import { PaymentOptionsProps } from "@/app/constants/types";
import { key } from "@/app/lib/uniqueKey";
import React from "react";

interface OptionListProps {
  options: PaymentOptionsProps[];
  subHeader: string;
}
const OptionList = ({ options, subHeader }: OptionListProps) => {
  return (
    <div className="p-4 md:p-5">
      <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
        {subHeader}
      </p>
      <ul className="my-4 space-y-3">
        {options.map(
          ({
            id,
            option,
            icon,
            callBack,
            description,
            isPopular,
          }: PaymentOptionsProps) => {
            return (
              <li key={id}>
                <button
                  onClick={callBack}
                  className="flex w-full  items-center p-1 text-sm font-Medium text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                >
                  {icon}

                  <span className="ms-3 whitespace-nowrap">{option}</span>
                  {isPopular && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-thin text-tremor-brand-primary bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                      {releaseText}
                    </span>
                  )}
                </button>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

export default React.memo(OptionList);
