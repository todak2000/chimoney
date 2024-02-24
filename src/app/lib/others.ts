import { showToastError, showToastSuccess } from "@/app/lib/toast";
import { UserProps } from "../constants/types";
export const onSubmit = async (
  values: any,

  resetForm: () => void,
  subHeader: string,
  userr: { accountNo?: string; email?: string; prefferedCurrency?: string },
  userBalance: { chi: number },
  showToastError: (msg: string) => void,
  submitFn: (values: {
    amount: number;
    receiverID?: string;
    payeeID?: string;
    email?: string;
  }) => void,
  setEmail: (email: string) => void,
  setName: (name: string) => void,
  currentExchangeRate: () => number,
  setBanks: (banks: object[]) => void,
  setBranches: (branches: object[]) => void
) => {
  const resetState = () => {
    setEmail("");
    setName("");
    setBanks([]);
    setBranches([]);
    resetForm();
  };

  const dynamicAmount =
    userr.prefferedCurrency === "USD"
      ? values.amount
      : values.amount / currentExchangeRate();

  if (
    subHeader.includes("Send Fund") &&
    (userr.accountNo === values.receiverID || userr.email === values.email)
  ) {
    showToastError(
      `Oops! you can't send money  to same ${userr.accountNo === values.receiverID ? "wallet" : "email address"}. Please enter a different ${userr.accountNo === values.receiverID ? "wallet ID" : "email Address"}`
    );
  } else if (
    subHeader.includes("Send Fund") &&
    userBalance &&
    userBalance?.chi < dynamicAmount
  ) {
    showToastError("Oops! you have insufficient balance");
  } else if (
    subHeader === "Send Fund via Wallet" &&
    userBalance &&
    userBalance?.chi >= dynamicAmount
  ) {
    submitFn({
      amount: dynamicAmount,
      receiverID: values.receiverID,
      payeeID: userr.accountNo,
    });

    resetState();
  } else if (
    subHeader === "Send Fund to Bank" &&
    userBalance &&
    userBalance?.chi >= dynamicAmount
  ) {
    submitFn(values);
    resetState();
  } else {
    submitFn({
      amount: dynamicAmount,
      email: values.email,
    });
    resetState();
  }
};

export const copyToClipboard = async (
  key: string,
  value: string,
  userr: UserProps
) => {
  try {
    await navigator.clipboard.writeText(value);
    showToastSuccess(
      `${getKeyName(key, userr) ?? key} has been copied successfully!`
    );
  } catch (err) {
    showToastError(`Failed to copy ${key} value successfully!`);
    console.error("Failed to copy text: ", err);
  }
};

export const getKeyName = (key: string, userr: UserProps) => {
  let name = "";
  switch (key) {
    case "accountNo":
      name = "Wallet ID";
      break;
    case "phone":
      name = "Phone Number";
      break;
    case "name":
      name = "Name";
      break;
    case "email":
      name = "Email Address";
      break;
    case "amount":
      name = `Amount (${userr.prefferedCurrency})`;
      break;
    case "receiverID":
      name = `Reciepient Chimoney Wallet ID`;
      break;
    case "country":
      name = `Reciepient Country`;
      break;
    case "bank":
      name = `Reciepient Bank`;
      break;
    case "accountNumber":
      name = `Reciepient Account Number`;
      break;
    case "branchCode":
      name = `Reciepient Bank Branch Code`;
      break;
    case "paymentId":
      name = `Payment Ref ID`;
      break;
    case "link":
      name = `Redeem Link`;
      break;
    case "chiRef":
      name = `Chimoney Ref ID`;
      break;
    case "payee":
      name = `Reciepient Email`;
      break;
    case "paymentLink":
      name = `Payment Link`;
      break;
    default:
      break;
  }
  return name;
};
