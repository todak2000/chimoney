import { clearUser, isLoading, setIsLoading, setUser, user } from "@/app/store";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentLink,
  deleteAccountDetails,
  getAccountDetails,
  getBanksDetails,
  getBranchCodes,
  getExchangeRate,
  sendP2P,
  sendToBank,
  sendbyEmail,
  updateAccountDetails,
} from "@/app/api/other/chimoney";
import { getAccountId, handleGoogleSignOut } from "@/app/api/auth";
import { showToastError, showToastSuccess } from "@/app/lib/toast";
import { AccProps } from "@/app/constants/types";

// get user Details
export const useGetUserChimoneyDetails = (id: string) => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["userDetails"] });
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => getAccountDetails(id),
    enabled: !!id,
  });
};

export const useAuthStateChange = () => {
  const dispatch = useDispatch();
  const userr = useSelector(user);

  const { push } = useRouter();

  const onAuthStateChanged = useCallback(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && (userr?.name === "" || !userr?.accountNo)) {
        dispatch(setIsLoading(true));
        const fbDetails = await getAccountId(firebaseUser?.uid); //from firebase
        if (fbDetails) {
          const userData = {
            name: firebaseUser?.displayName as string,
            email: firebaseUser?.email as string,
            photo: firebaseUser?.photoURL as string,
            uid: firebaseUser?.uid,
            accountNo: fbDetails?.accountNo,
            phone: fbDetails?.phone,
          };
          setTimeout(() => {
            dispatch(setUser(userData));
            dispatch(setIsLoading(false));
          }, 2000);
        } else {
          dispatch(clearUser());
          dispatch(setIsLoading(false));
          push("/");
        }
      } else if (!firebaseUser) {
        dispatch(clearUser());
        dispatch(setIsLoading(false));
        push("/");
      }
    });

    return () => unsubscribe();
  }, [dispatch, userr, push]);

  useEffect(() => {
    return onAuthStateChanged();
  }, [onAuthStateChanged]);
};

export const useSignOut = () => {
  const { push } = useRouter();

  const handleSignOut = useCallback(async () => {
    const res = await handleGoogleSignOut();
    if (res.status === 200) {
      push("/");
      showToastSuccess("You are logged out!");
    } else {
      showToastError(res.message);
    }
  }, [push]);

  return handleSignOut;
};

export const useAccountData = () => {
  const [accountData, setAccountData] = useState<AccProps[]>([]);
  const [phone, setPhone] = useState<string>("");
  const dispatch = useDispatch();
  const userr = useSelector(user);
  const isLoadingg = useSelector(isLoading);
  const { isPending, data, error, isSuccess, isError } =
    useGetUserChimoneyDetails(userr.accountNo);

  const handleSuccess = useCallback(() => {
    if (isSuccess) {
      setAccountData(data?.data?.wallets);
      setPhone(data?.data?.phone);
    }
  }, [isSuccess, data, isLoadingg, dispatch, userr]);

  const handleError = useCallback(() => {
    if (isError || error) {
      showToastError("Oops! an error occured!");
    }
  }, [isError, error]);

  useEffect(() => {
    handleSuccess();
    handleError();
  }, [
    handleSuccess,
    handleError,
    useGetUserChimoneyDetails,
    dispatch,
    isLoadingg,
    userr,
  ]);

  return { accountData, isPending, phone };
};

export const useCreatePaymentLink = () => {
  const mutation = useMutation({
    mutationFn: (data: { amount: number; email: string }) =>
      createPaymentLink(data),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    handlePaymentLink: (data: { amount: number; email: string }) =>
      mutate(data),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

export const useSendP2P = () => {
  const mutation = useMutation({
    mutationFn: (data: {
      amount: number;
      receiverID: string;
      payeeID: string;
    }) => sendP2P(data),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    handleP2P: (data: {
      amount: number;
      receiverID: string;
      payeeID: string;
    }) => mutate(data),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};
export const useGetUserChimoneyDetails1 = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => getAccountDetails(id),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    getAccountDetails: (id: string) => mutate(id),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

export const useGetBanksDetails = () => {
  const mutation = useMutation({
    mutationFn: (code: string) => getBanksDetails(code),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    getBanksDetails: (code: string) => mutate(code),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

export const useGetBranchCodes = () => {
  const mutation = useMutation({
    mutationFn: (code: string) => getBranchCodes(code),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    getBranchCodes: (code: string) => mutate(code),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

export const useSendByEmail = () => {
  const mutation = useMutation({
    mutationFn: (data: { amount: number; email: string }) => sendbyEmail(data),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    handleSendByEmail: (data: { amount: number; email: string }) =>
      mutate(data),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

export const useSendToBank = () => {
  const mutation = useMutation({
    mutationFn: (data: {
      amount: number;
      accountNumber: string;
      bank: string;
      country: string;
      fullname?: string;
      branchCode?: string;
    }) => sendToBank(data),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    handleSendToBank: (data: {
      amount: number;
      accountNumber: string;
      bank: string;
      country: string;
      fullname?: string;
      branchCode?: string;
    }) => mutate(data),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

export const useUserBalance = (accountData: AccProps[]) => {
  return useMemo(() => {
    if (accountData && accountData.length > 0) {
      return {
        chi: accountData[2].balance,
        momo: accountData[0].balance,
        airtime: accountData[0].balance,
      };
    }
  }, [accountData]);
};

// Custom hook for handling banks data
export const useHandleBanksData = (
  banksData: { status: string; data: object[] },
  banksIsSuccess: boolean
) => {
  const [banks, setBanks] = useState<object[]>([]);

  useEffect(() => {
    if (banksData && banksData.status === "success" && banksIsSuccess) {
      banksData?.data && banksData?.data.length
        ? setBanks(banksData?.data as [])
        : setBanks([
            { name: "No bank found for this country", code: 9999999 },
          ] as never[]);
    }
  }, [banksData, banksIsSuccess]);

  return { banks, setBanks };
};

// Custom hook for handling branch data
export const useHandleBranchData = (
  branchData: { status: string; data: object[] },
  branchIsSuccess: boolean
) => {
  const [branches, setBranches] = useState<object[]>([]);

  useEffect(() => {
    if (branchData && branchData.status === "success" && branchIsSuccess) {
      branchData?.data && branchData?.data.length
        ? setBranches(branchData?.data as [])
        : setBranches([
            { name: "No branch found for this bank!", code: 9999999 },
          ] as never[]);
    }
  }, [branchData, branchIsSuccess]);

  return { branches, setBranches };
};

// Custom hook for handling wallet data
export const useHandleWalletData = (
  walletData: {
    status: string;
    data: { id: string; email: string; name: string };
  },
  walletIsSuccess: boolean,
  userr: { accountNo: string },
  showToastError: (arg0: string) => void
) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (
      walletData &&
      walletData.status === "success" &&
      walletIsSuccess &&
      walletData.data.id !== userr.accountNo
    ) {
      setEmail(walletData?.data?.email);
      setName(walletData?.data?.name);
    }
    if (
      walletData &&
      walletData.status === "success" &&
      walletIsSuccess &&
      walletData.data.id === userr.accountNo
    ) {
      showToastError(
        "Oops! you can't send money  to same Wallet. Please enter a different wallet ID"
      );
      setEmail("");
      setName("");
    }
    if (walletData && walletData.status === "error") {
      showToastError("Oops! Wallet ID not found");
      setEmail("");
      setName("");
    }
  }, [walletData, walletIsSuccess]);

  return { email, name, setEmail, setName };
};

export const useExchangeRate = () => {
  return useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => getExchangeRate(),
  });
};

export const useCurrentExchangeRate = (
  exchangeData: any,
  exchangePending: boolean
) => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["exchangeRates"] });
  return useCallback(() => {
    let value: number;

    if (exchangeData && exchangeData?.status === "success") {
      value = exchangeData?.data.USDNGN;
    } else {
      value = 1490.12;
    }
    return value;
  }, [exchangeData, exchangePending]);
};

export const useUpdateAccountDetails = () => {
  const mutation = useMutation({
    mutationFn: (data: { id: string; phone: string; fbuid: string }) =>
      updateAccountDetails(data),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    updateAccountDetails: (data: {
      id: string;
      phone: string;
      fbuid: string;
    }) => mutate(data),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};

//
export const useDeleteAccountDetails = () => {
  const mutation = useMutation({
    mutationFn: (data: { id: string; fbuid: string }) =>
      deleteAccountDetails(data),
  });

  const { mutate, isError, data, isSuccess, error, isPending } = mutation;

  return {
    deleteAccountDetails: (data: { id: string; fbuid: string }) => mutate(data),
    isError,
    isSuccess,
    isPending,
    error,
    data,
  };
};
