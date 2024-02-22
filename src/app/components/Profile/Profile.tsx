/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { RiEditLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { AiTwotoneCopy } from "react-icons/ai";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";
import { user } from "@/app/store";
import ButtonSquare from "@/app/components/Button/ButtonSquare";
import { key } from "@/app/lib/uniqueKey";
import { ButtArrProps, UserProps } from "@/app/constants/types";
import { copyToClipboard } from "@/app/lib/others";
import { GrSend } from "react-icons/gr";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FieldProps,
  FormikValues,
} from "formik";
import { cn } from "@/app/lib/cn";
import Loader from "@/app/components/loader/Loader";
import LogOutModal from "@/app/components/Modal/LogOutModal";
import { useUpdateAccountDetails } from "@/app/hooks";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
const Profile = () => {
  const userr = useSelector(user);
  const [edit, setEdit] = useState<boolean>(false);
  const [delet, setDelet] = useState<boolean>(false);

  const {
    updateAccountDetails,
    isPending: updateIsPending,
    isError: updateIsError,
    isSuccess: updateSuccess,
    error: updateError,
  } = useUpdateAccountDetails();
  useEffect(() => {
    if (updateSuccess) {
      showToastSuccess("Your data has been updated successfully!");
    }
    if (updateIsError) {
      showToastError("Oops! an error occured");
    }
  }, [updateSuccess, updateIsError]);

  const buttonArr: ButtArrProps[] = [
    {
      id: key(),
      title: edit ? "Done Editing" : "Edit",
      icon: (
        <RiEditLine
          className={cn("text-black text-sm  mr-3", {
            "dark:text-white hover:text-white": !edit,
            "dark:text-red-500 hover:text-red-500": edit,
          })}
        />
      ),
      onClick: () => setEdit(!edit),
      loading: false,
      className:
        "hover:bg-transparent hover:text-tremor-brand-primary dark:text-white text-white",
    },
    {
      id: key(),
      title: "Delete",
      icon: (
        <MdOutlineDelete className="text-black text-sm dark:text-white hover:text-white" />
      ),
      onClick: () => setDelet(true),
      loading: false,
      className:
        "bg-transparent hover:bg-tremor-brand-primary hover:border-transparent hover:text-white text-black border-[1px] dark:border-[0.27px] dark:text-white border-[#E9EBF2]",
    },
  ];
  return (
    <section className="w-full space-y-4  flex flex-col md:flex-row items-center justify-evenly">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center py-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={userr.photo}
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {userr.name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {userr.email}
          </span>
          <div className="flex mt-4 md:mt-6 space-x-6">
            {buttonArr.map(
              ({
                id,
                title,
                icon,
                loading,
                onClick,
                className,
              }: ButtArrProps) => {
                return (
                  <Link
                    href="#"
                    key={id}
                    onClick={onClick}
                    className=" flex text-xs px-3 py-3 rounded-sm flex-row items-center space-x-2 bg-transparent hover:bg-gray-200 hover:border-transparent text-black  dark:text-white "
                  >
                    {icon} {title}
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div className="w-full p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Formik
          initialValues={{
            name: userr.name,
            email: userr.email,
            accountNo: userr.accountNo,
            phone: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            setTimeout(() => {
              alert(JSON.stringify(values));
              updateAccountDetails({
                id: userr.accountNo,
                phone: values.phone,
              });
              resetForm;
            }, 500);
          }}
        >
          {({ handleChange, values }) => (
            <Form className="p-4 md:p-5">
              {Object?.entries(userr as object)
                ?.filter(
                  ([key, value]) =>
                    key !== "prefferedCurrency" &&
                    key !== "photo" &&
                    key !== "uid" &&
                    key !== "accountNo"
                )
                .map(([key, value]) => (
                  <>
                    <div key={key} className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <div className="flex">
                          <span
                            className=" inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 cursor-pointer rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                            onClick={() => copyToClipboard(key, value)}
                          >
                            <span className="capitalize"> {key}</span>
                            <AiTwotoneCopy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </span>
                          <input
                            type="text"
                            id={key}
                            disabled={edit && key !== "phone"}
                            name={key}
                            onChange={handleChange}
                            maxLength={key === "phone" ? 15 : 99}
                            value={(values as FormikValues)[key]}
                            className={cn(
                              "rounded-none rounded-e-lg  border text-gray-900 focus:ring-tremor-brand-primary focus:border-tremor-brand-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary",
                              {
                                " bg-gray-50 border text-gray-900 focus:ring-tremor-brand-primary focus:border-tremor-brand-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 d dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary":
                                  edit && key === "phone",
                                " bg-tremor-brand-secondary border text-gray-900 focus:ring-tremor-brand-primary focus:border-tremor-brand-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary":
                                  !edit,
                              }
                            )}
                            placeholder={
                              key === "phone" ? "Enter your phone number" : key
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              {edit && (
                <button
                  type="submit"
                  disabled={updateIsPending}
                  className="text-white inline-flex items-center bg-tremor-brand-primary hover:tremor-brand-primary focus:ring-4 focus:outline-none focus:ring-tremor-brand-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-tremor-brand-primary dark:hover:bg-tremor-brand-primary dark:focus:ring-tremor-brand-primary"
                >
                  {updateIsPending ? (
                    <Loader />
                  ) : (
                    <>
                      <GrSend className="me-1 -ms-1 w-5 h-5 text-white" />
                      <span>Update</span>
                    </>
                  )}
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <LogOutModal
        open={delet}
        setOpen={setDelet}
        callBack={() => null}
        text="Are you sure you want to Delete your Account?"
      />
    </section>
  );
};

export default Profile;
