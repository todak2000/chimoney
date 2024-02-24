import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Formik, Field, Form, ErrorMessage, FieldProps } from "formik";
import Loader from "@/app/components/loader/Loader";
import {
  useCurrentExchangeRate,
  useGetBanksDetails,
  useGetBranchCodes,
  useGetUserChimoneyDetails1,
  useHandleBanksData,
  useHandleBranchData,
  useHandleWalletData,
} from "@/app/hooks";
import { useSelector } from "react-redux";
import { user } from "@/app/store";
import { GrSend } from "react-icons/gr";
import { showToastError } from "@/app/lib/toast";
import { FormProps, SelectInputProps } from "@/app/constants/types";
import {
  SendFundMessage,
  classNameToUse,
  componentToUse,
  isEmailOrName,
  isFormLoading,
  isFullnameAndNG,
  isReceiverID,
  isSendFundViaWallet,
  maxLengthToUse,
  onSelectToUse,
  optionsToUse,
  showBranchCodeComponent,
  showFullNameComponent,
  showFullNameComponentNG,
  valueToUse,
} from "@/app/constants/modal";
import { getKeyName, onSubmit } from "@/app/lib/others";

const SelectInput = ({ field, form, options, onSelect }: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryCode = e.target.value;
    const selectedCountryText = e.target.options[e.target.selectedIndex].text;
    setSelectedValue(selectedCountryCode);
    field.name === "country"
      ? form.setFieldValue(field.name, selectedCountryText)
      : form.setFieldValue(field.name, selectedCountryCode);
    onSelect && onSelect(selectedCountryCode);
  };

  return (
    <select
      {...field}
      value={selectedValue}
      disabled={options.length === 0}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-tremor-brand-primary dark:focus:border-tremor-brand-primary"
    >
      <option>Select</option>
      {options?.map((option) => (
        <option key={option.code} value={option.code}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

const CurrencyInput = ({ field, form }: FieldProps) => {
  const [keyState, setKeyState] = useState<boolean>(true);
  const [originalValue, setOriginalValue] = useState<string>("");
  const userr = useSelector(user);
  const currentExchangeRate = useCurrentExchangeRate();

  const value =
    userr.prefferedCurrency === "USD"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(field.value)
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "NGN",
        }).format(field.value);

  return (
    <>
      <input
        {...field}
        value={keyState ? originalValue : value}
        onKeyUp={() =>
          setTimeout(() => {
            setKeyState(false);
          }, 1500)
        }
        onKeyDown={() => setKeyState(true)}
        onChange={(e) => {
          const number = Number(e.target.value.replace(/[^0-9.-]+/g, ""));
          setOriginalValue(number?.toString());
          form.setFieldValue(field.name, number);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      />
      {field.value !== "" && userr.prefferedCurrency !== "USD" && (
        <span className="text-tremor-brand-primary text-xs ">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(field.value / currentExchangeRate())}
        </span>
      )}
    </>
  );
};

const ModalForm = ({
  data,
  subHeader,
  backFn,
  currentExchangeRate,
  schema,
  loading,
  submitFn,
  userBalance,
}: FormProps) => {
  const [namePending, setNamePending] = useState<boolean>(false);
  const userr = useSelector(user);
  const {
    getAccountDetails,
    isSuccess: walletIsSuccess,
    data: walletData,
    isPending: walletPending,
  } = useGetUserChimoneyDetails1();

  const {
    getBanksDetails,
    isSuccess: banksIsSuccess,
    data: banksData,
    isPending: banksPending,
  } = useGetBanksDetails();

  const {
    getBranchCodes,
    isSuccess: branchIsSuccess,
    data: branchData,
    isPending: branchPending,
  } = useGetBranchCodes();

  const { banks, setBanks } = useHandleBanksData(banksData, banksIsSuccess);
  const { branches, setBranches } = useHandleBranchData(
    branchData,
    branchIsSuccess
  );
  const { email, name, setEmail, setName } = useHandleWalletData(
    walletData,
    walletIsSuccess,
    userr,
    showToastError
  );

  const handleKeyUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value.length >= 36) {
      setTimeout(() => {
        getAccountDetails(e?.target?.value);
      }, 1500);
    }
  };
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

      <Formik
        initialValues={data.reduce((acc, curr) => ({ ...acc, ...curr }), {})}
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          onSubmit(
            values,
            resetForm,
            subHeader,
            userr,
            userBalance as { chi: number; momo: number; airtime: number },
            showToastError,
            submitFn,
            setEmail,
            setName,
            currentExchangeRate,
            setBanks,
            setBranches
          );
        }}
      >
        {({ handleChange, values }) => (
          <Form className="p-4 md:p-5">
            {data.map((field) =>
              Object.entries(field).map(([key, value]) => {
                if (
                  showBranchCodeComponent(key, values["country"] as string) ||
                  showFullNameComponent(key, values["accountNumber"] as string)
                ) {
                  return null;
                }
                if (
                  showFullNameComponentNG(
                    key,
                    values["accountNumber"] as string,
                    values["country"] as string
                  )
                ) {
                  setNamePending(true);
                  setTimeout(() => {
                    setNamePending(false);
                  }, 2000);
                }
                return (
                  <div key={key} className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor={key}
                        className="capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {getKeyName(key, userr)}
                      </label>
                      <Field
                        id={key}
                        disabled={
                          (isSendFundViaWallet(subHeader) &&
                            isEmailOrName(key)) ||
                          isFullnameAndNG(key, values["country"] as string)
                        }
                        name={key}
                        placeholder={value}
                        value={valueToUse(
                          key,
                          email,
                          subHeader,
                          name,
                          values[key] as string
                        )}
                        maxLength={maxLengthToUse(
                          key,
                          values["country"] as string
                        )}
                        onKeyUp={isReceiverID(key) ? handleKeyUp : undefined}
                        onKeyDown={isReceiverID(key) ? handleKeyUp : undefined}
                        handleChange={handleChange}
                        options={optionsToUse(key, branches, banks)}
                        onSelect={onSelectToUse(
                          key,
                          getBanksDetails,
                          getBranchCodes
                        )}
                        component={componentToUse(
                          key,
                          CurrencyInput,
                          SelectInput
                        )}
                        className={classNameToUse(key, subHeader)}
                      />

                      {isFormLoading(
                        walletPending,
                        banksPending,
                        branchPending,
                        namePending,
                        subHeader,
                        values["receiverID"] as string
                      ) ? (
                        <span className="absolute top-1/2 right-1/2 text-tremor-brand-primary text-lg ">
                          <Loader />
                        </span>
                      ) : null}

                      <ErrorMessage
                        name={key}
                        className="text-red-400  text-xs"
                        component="div"
                      />
                    </div>
                  </div>
                );
              })
            )}
            <button
              type="submit"
              disabled={loading}
              className="text-white inline-flex items-center bg-tremor-brand-primary hover:tremor-brand-primary focus:ring-4 focus:outline-none focus:ring-tremor-brand-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-tremor-brand-primary dark:hover:bg-tremor-brand-primary dark:focus:ring-tremor-brand-primary"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <GrSend className="me-1 -ms-1 w-5 h-5 text-white" />
                  <span>
                    {subHeader.includes("Send Fund") ? (
                      <SendFundMessage
                        currency={userr.prefferedCurrency as string}
                        amountValue={values?.amount as string}
                      />
                    ) : (
                      "Create Link"
                    )}
                  </span>
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ModalForm;
