import { PaymentLinkProps } from "@/app/constants/types";
import { httpRequest } from "@/app/lib/httpRequest";
import { handleDeleteUser, handlePhoneNumber } from "@/app/api/auth";
export const baseURL = `${process.env.NEXT_PUBLIC_CHIMONEY_URL}/v0.2`;

export const getAccountDetails = async (id: string) => {
  return httpRequest(`${baseURL}/sub-account/get?id=${id}`, "GET");
};

export const getBanksDetails = async (code: string) => {
  return httpRequest(
    `${baseURL}/info/country-banks?countryCode=${code}`,
    "GET"
  );
};

export const getExchangeRate = async () => {
  return httpRequest(`${baseURL}/info/exchange-rates`, "GET");
};
export const getBranchCodes = async (code: string) => {
  return httpRequest(`${baseURL}/info/bank-branches?bankCode=${code}`, "GET");
};

export const sendP2P = async (data: {
  amount: number;
  receiverID: string;
  payeeID: string;
}) => {
  const payload = {
    wallets: [
      {
        receiver: data.receiverID,
        valueInUSD: data.amount,
      },
    ],
    subAccount: data.payeeID,
  };
  return httpRequest(`${baseURL}/payouts/wallet`, "POST", payload);
};

export const updateAccountDetails = async (data: {
  id: string;
  phone: string;
  fbuid: string;
}) => {
  const payload = {
    meta: {
      phone: data.phone,
    },
    phoneNumber: data.phone,
    id: data.id,
  };

  // Call updateUserPhoneNumber and httpRequest simultaneously
  const [phoneUpdateResult, httpRequestResult] = await Promise.all([
    handlePhoneNumber({ userId: data.fbuid, phone: data.phone }),
    httpRequest(`${baseURL}/sub-account/update`, "POST", payload),
  ]);

  // Merge the results
  const result = {
    status:
      phoneUpdateResult.status === 200 && httpRequestResult.status === "success"
        ? 200
        : 409,
    phone: phoneUpdateResult.phone,
  };
  return result;
};

// handleDeleteUser
export const deleteAccountDetails = async (data: {
  id: string;
  fbuid: string;
}) => {
  // Call updateUserPhoneNumber and httpRequest simultaneously
  const [deleteResult, httpRequestResult] = await Promise.all([
    handleDeleteUser(data.fbuid),
    httpRequest(`${baseURL}/sub-account/delete?id=${data.id}`, "DELETE"),
  ]);

  // Merge the results
  const result = {
    status: httpRequestResult.status === "success" ? 200 : 409,
    message:
      httpRequestResult.status === "success"
        ? "Your account has been successfully deleted. We’re sorry to see you go and hope to see you again in the future. Take care! 😔"
        : "Oops! an error occured",
  };
  return result;
};
export const createPaymentLink = async (data: {
  amount: number;
  email: string;
}) => {
  const payload: PaymentLinkProps = {
    meta: {
      isRedirectFromChimoney: "true",
    },
    valueInUSD: data.amount,
    payerEmail: data.email,
    redirect_url: process.env.NEXT_PUBLIC_REDIRECT_URL as string,
  };
  return httpRequest(`${baseURL}/payment/initiate`, "POST", payload);
};

export const sendbyEmail = async (data: { amount: number; email: string }) => {
  const payload = {
    chimoneys: [
      {
        email: data.email,
        valueInUSD: data.amount,
      },
    ],
    turnOffNotification: true,
  };
  return httpRequest(`${baseURL}/payouts/chimoney`, "POST", payload);
};

export const sendToBank = async (data: {
  amount: number;
  accountNumber: string;
  bank: string;
  country: string;
  fullname?: string;
  branchCode?: string;
}) => {
  const payload = {
    banks: [
      {
        countryToSend: data.country,
        fullname: data.fullname ?? "",
        branch_code: data.branchCode ?? "",
        valueInUSD: data.amount,
        account_number: data.accountNumber,
        account_bank: data.bank,
      },
    ],
  };
  return httpRequest(`${baseURL}/payouts/bank`, "POST", payload);
};
