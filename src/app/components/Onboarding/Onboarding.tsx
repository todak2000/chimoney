"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCirclePlay, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import { cn } from "../../lib/cn";

import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import { SigninSchema, SignupSchema } from "@/app/constants/validation";
import { handleEmailAuth } from "@/app/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { isLoading } from "@/app/store";
import Loader from "../loader/Loader";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
import { useRouter } from "next/navigation";

const Onboarding = ({
  open,
  setOpen,
}: {
  open: string;
  setOpen: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { push } = useRouter();
  const isLoadingg = useSelector(isLoading);
  const dispatch = useDispatch();
  const formData = [
    {
      name: "",
    },
    {
      email: "",
    },
    {
      password: "",
    },
    {
      confirmPassword: "",
    },
  ];

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div
      id="crypto-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={cn(
        "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-300 opacity-100",
        {
          hidden: open === "",
          flex: open === "signup" || open === "signin",
        }
      )}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white  rounded-lg shadow dark:bg-gray-700">
          <div className="flex flex-row items-center justify-center py-4">
            <FaCirclePlay className="text-tremor-brand-primary text-xl mx-2" />
            <span className=" text-tremor-brand-primary text-xl">Chimoney</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen("")}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white absolute right-4 top-4"
            data-modal-toggle="crypto-modal"
          >
            <IoClose className="text-gray-400 text-sm" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {open === "signup" ? "Sign Up" : "Sign In"}
            </h3>
          </div>
          <Formik
            initialValues={
              open === "signup"
                ? {
                    email: "",
                    name: "",
                    password: "",
                    confirmPassword: "",
                  }
                : {
                    email: "",
                    password: "",
                  }
            }
            validationSchema={open === "signup" ? SignupSchema : SigninSchema}
            onSubmit={async (values, { resetForm }) => {
              const data =
                open === "signup"
                  ? {
                      email: values?.email,
                      password: values?.password,
                      name: values?.name,
                    }
                  : {
                      email: values?.email,
                      password: values?.password,
                    };
              const res = await handleEmailAuth(dispatch, data, open);
              if (res && res.status === 200) {
                showToastSuccess(res.message);
                setOpen("");
                push("/dashboard");
              } else {
                showToastError(res.message);
              }
              resetForm();
            }}
          >
            {({ handleChange, values, submitForm }) => (
              <Form className="max-w-sm mx-auto p-4 md:p-0 md:pb-8">
                {formData.map((field) =>
                  Object.entries(field).map(([key, value]) => {
                    if (
                      open === "signin" &&
                      (key === "confirmPassword" || key === "name")
                    ) {
                      return null;
                    }
                    if (key === "password" || key === "confirmPassword") {
                      return (
                        <div className="mb-5 relative" key={key}>
                          <label
                            htmlFor={key}
                            className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {key}
                          </label>
                          <div className="flex flex-row relative">
                            <Field
                              id={key}
                              type={showPassword ? "text" : "password"}
                              name={key}
                              onChange={handleChange}
                              value={(values as FormikValues)[key]}
                              className="bg-gray-50 border border-gray-300 relative text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                              required
                            />
                            {showPassword ? (
                              <FaRegEyeSlash
                                className="text-gray-500 absolute bottom-3 right-2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                              />
                            ) : (
                              <FaRegEye
                                className="text-gray-500 absolute bottom-3 right-2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                              />
                            )}
                          </div>

                          <ErrorMessage
                            name={key}
                            className="text-red-400  text-xs"
                            component="div"
                          />
                        </div>
                      );
                    }
                    return (
                      <div className="mb-5" key={key}>
                        <label
                          htmlFor={key}
                          className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {key}
                        </label>
                        <Field
                          id={key}
                          type={
                            key === "password" && showPassword
                              ? "text"
                              : key === "password" && !showPassword
                                ? "password"
                                : key === "name"
                                  ? "name"
                                  : key
                          }
                          name={key}
                          onChange={handleChange}
                          value={(values as FormikValues)[key]}
                          className="bg-gray-50 border border-gray-300 relative text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                          required
                        />

                        <ErrorMessage
                          name={key}
                          className="text-red-400  text-xs"
                          component="div"
                        />
                      </div>
                    );
                  })
                )}

                <button
                  type="submit"
                  onClick={submitForm}
                  className="text-white bg-tremor-brand-primary hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-tremor-brand-primary dark:hover:bg-indigo-400 dark:focus:ring-indigo-800"
                >
                  {isLoadingg ? (
                    <span className="flex flex-row items-center justify-center">
                      <Loader />
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
