import { PaginationProps } from "@/app/constants/types";
import { cn } from "@/app/lib/cn";
import { key } from "@/app/lib/uniqueKey";
import React, { useState, useEffect } from "react";

const Pagination: React.FC<PaginationProps> = ({
  data,
  itemsPerPage,
  setCurrentData,
  value,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = currentPage === totalPages ? data.length : start + itemsPerPage;

  useEffect(() => {
    if (["CHI", "MOMO", "AIRTIME"].includes(value)) {
      setCurrentData(
        data.filter(({ wallet }) => wallet === value).slice(start, end)
      );
    } else if (["Debit", "Credit"].includes(value)) {
      setCurrentData(
        data.filter(({ type }) => type === value).slice(start, end)
      );
    } else {
      setCurrentData(data.slice(start, end));
    }
  }, [value, start, end, data]);
  const handlePrev = () => {
    setCurrentPage((oldPage) => Math.max(oldPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((oldPage) => Math.min(oldPage + 1, totalPages));
  };

  const paginationArr = [
    {
      text: "Prev",
      callBack: handlePrev,
      disabled: currentPage === 1,
      className: cn(
        "flex items-center rounded-s border-r-white border-r-[0.5px] justify-center px-3 h-8 text-xs font-medium",
        {
          "bg-indigo-100 text-indigo-300": currentPage === 1,
          "text-white bg-indigo-500 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white":
            currentPage !== 1,
        }
      ),
    },
    {
      text: "Next",
      callBack: handleNext,
      disabled: currentPage === totalPages,
      className: cn(
        "flex items-center rounded-e border-l-white border-l-[0.5px] justify-center px-3 h-8 text-xs font-medium",
        {
          "bg-indigo-100 text-indigo-300": currentPage === totalPages,
          "text-white bg-indigo-500 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white":
            currentPage !== totalPages,
        }
      ),
    },
  ];
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="inline-flex mt-2 xs:mt-0">
        {paginationArr.map(
          ({
            text,
            callBack,
            disabled,
            className,
          }: {
            text: string;
            callBack: () => void;
            disabled: boolean;
            className: string;
          }) => {
            return (
              <button
                key={key()}
                onClick={callBack}
                disabled={disabled}
                className={className}
              >
                {text}
              </button>
            );
          }
        )}
      </div>
      <span className="text-xs text-gray-700 dark:text-gray-400">
        {`Showing ${start + 1} to ${end} of ${data.length} Entries`}
      </span>
    </div>
  );
};

export default Pagination;
