"use client";
import Loader from "@/app/components/loader/Loader";
import { ButtonSquareProps } from "@/app/constants/types";
import { cn } from "@/app/lib/cn";

import React from "react";

const ButtonSquare = ({
  title,
  icon,
  onClick,
  loading,
  className,
}: ButtonSquareProps) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={cn(
        "flex text-xs text-white  flex-row items-center justify-center px-2 py-2 focus:ring-[0.7px] focus:outline-none focus:ring-tremor-brand-primary",
        className
      )}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          {icon}
          <span>{title}</span>
        </>
      )}
    </button>
  );
};

export default ButtonSquare;
