"use client";
import { handleGoogleAuth } from "@/app/api/auth";
import Loader from "@/app/components/loader/Loader";
import { GoogleButtonProps } from "@/app/constants/types";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";

const Button = ({ title }: GoogleButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    setLoading(true);
    const res = await handleGoogleAuth(dispatch);
    setLoading(false);
    if (res.status === 200) {
      showToastSuccess(res.message);
      push("/dashboard");
    } else {
      showToastError(res.message);
    }
  };
  return (
    <button
      disabled={loading}
      onClick={handleSubmit}
      className="flex text-xs text-white dark:invert-0 bg-tremor-brand-primary  flex-row items-center justify-center rounded-full px-4 py-3 focus:ring-[0.5px] focus:outline-none focus:ring-tremor-brand-primary"
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <span>{title}</span>
          <FcGoogle className="text-xl mx-2" />
        </>
      )}
    </button>
  );
};

export default Button;
