/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { RiEditLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneCopy } from "react-icons/ai";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";
import { clearUser, updateUserKey, user } from "@/app/store";
import { FiUserCheck } from "react-icons/fi";
import { key } from "@/app/lib/uniqueKey";
import { ButtArrProps } from "@/app/constants/types";
import { copyToClipboard, getKeyName } from "@/app/lib/others";
import { GrSend } from "react-icons/gr";
import { Formik, Form, FormikValues } from "formik";
import { cn } from "@/app/lib/cn";
import Loader from "@/app/components/loader/Loader";
import LogOutModal from "@/app/components/Modal/LogOutModal";
import { useDeleteAccountDetails, useUpdateAccountDetails } from "@/app/hooks";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
import { isCopyClickable } from "@/app/constants/modal";
import Image from "next/image";
import { IoPersonCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
const Profile = () => {
  const userr = useSelector(user);
  const { push } = useRouter();
  const [edit, setEdit] = useState<boolean>(false);
  const [delet, setDelet] = useState<boolean>(false);
  const dispatch = useDispatch();
  const {
    updateAccountDetails,
    isPending: updateIsPending,
    isError: updateIsError,
    isSuccess: updateSuccess,
    data: updateData,
  } = useUpdateAccountDetails();
  const {
    deleteAccountDetails,
    isPending: deleteIsPending,
    isError: deleteIsError,
    isSuccess: deleteSuccess,
    data: deleteData,
  } = useDeleteAccountDetails();

  useEffect(() => {
    if (updateSuccess && updateData && updateData.status === 200) {
      setEdit(false);
      dispatch(updateUserKey({ key: "phone", value: updateData.phone }));
      showToastSuccess("Your data has been updated successfully!");
    }
    if (updateIsError || (updateData && updateData.status !== 200)) {
      showToastError("Oops! an error occured");
    }
    if (deleteSuccess && deleteData && deleteData.status === 200) {
      dispatch(clearUser());
      push("/");
      showToastSuccess(deleteData.message);
    }
    if (deleteIsError || (deleteData && deleteData.status !== 200)) {
      showToastError(deleteData?.message as string);
    }
  }, [
    deleteSuccess,
    deleteIsError,
    deleteData,
    updateSuccess,
    updateIsError,
    updateData,
  ]);

  const buttonArr: ButtArrProps[] = [
    {
      id: key(),
      title: edit ? "Done Editing" : "Edit",
      icon: !edit ? (
        <RiEditLine className="text-black text-sm  mr-1 dark:text-white hover:text-red-500" />
      ) : (
        <FiUserCheck className="text-black text-sm  mr-1 dark:text-red-500 hover:text-red-500" />
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
        <MdOutlineDelete className="text-black text-sm dark:text-white hover:text-red-500 mr-1" />
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
          {userr.photo ? (
            <Image
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={userr?.photo}
              alt="User profile image"
              width={100}
              height={100}
              priority
            />
          ) : (
            <IoPersonCircle className="w-24 h-24 mb-3 text-gray-500 dark:invert" />
          )}

          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {userr.name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {userr.email}
          </span>
          <div className="flex mt-4 md:mt-6 space-x-6">
            {buttonArr.map(({ id, title, icon, onClick }: ButtArrProps) => {
              return (
                <Link
                  href="#"
                  key={id}
                  onClick={onClick}
                  className=" flex text-xs px-3 py-3 rounded-sm flex-row items-center space-x-2 bg-transparent hover:text-red-500 text-black  dark:text-white "
                >
                  {icon} {title}
                </Link>
              );
            })}
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
              updateAccountDetails({
                id: userr.accountNo,
                phone: values.phone,
                fbuid: userr.uid,
              });
              resetForm();
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
                    key !== "uid"
                )
                .map(([key, value]) => (
                  <div key={key} className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <div className="flex">
                        <span
                          className={cn(
                            " inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300  rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600",
                            {
                              "cursor-pointer": isCopyClickable(
                                key,
                                values["phone"]
                              ),
                            }
                          )}
                          onClick={
                            isCopyClickable(key, values["phone"])
                              ? () => copyToClipboard(key, value, userr)
                              : () => null
                          }
                        >
                          <span className="capitalize mr-1">
                            {getKeyName(key, userr)}
                          </span>
                          {isCopyClickable(key, values["phone"]) && (
                            <AiTwotoneCopy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </span>
                        <input
                          type="text"
                          id={key}
                          data-testid={key}
                          disabled={(edit && key !== "phone") || !edit}
                          name={key}
                          onChange={handleChange}
                          maxLength={key === "phone" ? 15 : 99}
                          value={
                            key === "phone" && !edit
                              ? userr.phone
                              : (values as FormikValues)[key]
                          }
                          className={cn(
                            "rounded-none rounded-e-lg  border text-gray-900 focus:ring-tremor-brand-primary focus:border-tremor-brand-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary",
                            {
                              "bg-tremor-brand-secondary border text-gray-900 focus:ring-tremor-brand-primary focus:border-tremor-brand-primary block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary":
                                (edit && key !== "phone") || !edit,
                            }
                          )}
                          placeholder={key === "phone" ? "+2348012345678" : key}
                        />
                      </div>
                    </div>
                  </div>
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
        loading={deleteIsPending}
        callBack={() =>
          deleteAccountDetails({
            id: userr.accountNo,
            fbuid: userr.uid,
          })
        }
        text="😔 Are you sure you want to Delete your Account?"
      />
    </section>
  );
};

export default Profile;
