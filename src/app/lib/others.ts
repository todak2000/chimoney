import { showToastError, showToastSuccess } from "@/app/lib/toast";

export const onSubmit = async (
  values: any,
  resetForm: () => void,
  subHeader: string,
  userr: { accountNo: string },
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

  if (
    subHeader.includes("Send Fund") &&
    userr.accountNo === values.receiverID
  ) {
    showToastError(
      "Oops! you can't send money  to same Wallet. Please enter a different wallet ID"
    );
  } else if (
    subHeader.includes("Send Fund") &&
    userBalance &&
    userBalance?.chi < Number(values.amount)
  ) {
    showToastError("Oops! you have insufficient balance");
  } else if (
    subHeader === "Send Fund via Wallet" &&
    userBalance &&
    userBalance?.chi >= Number(values.amount)
  ) {
    submitFn({
      amount: values.amount,
      receiverID: values.receiverID,
      payeeID: userr.accountNo,
    });
    resetState();
  } else if (
    subHeader === "Send Fund to Bank" &&
    userBalance &&
    userBalance?.chi >= Number(values.amount)
  ) {
    submitFn(values);
    resetState();
  } else {
    submitFn(values as { amount: number; email: string });
    resetState();
  }
};

export const copyToClipboard = async (key: string, value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    showToastSuccess(`${key} has been copied successfully!`);
  } catch (err) {
    showToastError(`Failed to copy ${key} value successfully!`);
    console.error("Failed to copy text: ", err);
  }
};
