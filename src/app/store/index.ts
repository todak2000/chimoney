/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import {
  AccProps,
  StateProps,
  TransactionsProps,
  UserProps,
} from "@/app/constants/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { configureStore, createSlice } from "@reduxjs/toolkit";

const defaultCurrency = "USD";

export const initialUser: UserProps = {
  name: "",
  email: "",
  photo: "",
  uid: "",
  accountNo: "",
  phone: "",
  prefferedCurrency: defaultCurrency,
};
export const initiaAcc: AccProps[] = [];

// User slice
const AccountSlice = createSlice({
  name: "accountData",
  initialState: initiaAcc,
  reducers: {
    setAccountData: (_state: AccProps[], action: PayloadAction<AccProps[]>) => {
      return action.payload;
    },
    updateBalanceAndAddTransaction: (
      state: AccProps[],
      action: PayloadAction<{
        accountId: string;
        newBalance: number;
        transaction: TransactionsProps;
      }>
    ) => {
      const { accountId, newBalance, transaction } = action.payload;
      const accountIndex = state.findIndex((acc) => acc.id === accountId);
      if (accountIndex !== -1) {
        state[accountIndex].balance = newBalance;
        state[accountIndex].transactions.push(transaction);
      }

      return state;
    },
  },
});

// User slice
const UserSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser: (
      state: UserProps,
      action: PayloadAction<Omit<UserProps, "prefferedCurrency">>
    ) => {
      return {
        ...action.payload,
        prefferedCurrency: state.prefferedCurrency,
      };
    },
    clearUser: () => {
      return initialUser;
    },
    updateCurrency: (
      state: UserProps,
      action: PayloadAction<"USD" | "NGN">
    ) => {
      return { ...state, prefferedCurrency: action.payload };
    },
    updateUserKey: (
      state: UserProps,
      action: PayloadAction<{ key: keyof UserProps; value: any }>
    ) => {
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    },
  },
});

// Loader
const LoaderSlice = createSlice({
  name: "isLoading",
  initialState: true,
  reducers: {
    setIsLoading: (_state: boolean, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

// Tab
const TabSlice = createSlice({
  name: "tabIndex",
  initialState: 0,
  reducers: {
    setTabIndex: (_state: number, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});
export const { setUser, clearUser, updateCurrency, updateUserKey } =
  UserSlice.actions;
export const { setIsLoading } = LoaderSlice.actions;
export const { setTabIndex } = TabSlice.actions;
export const { setAccountData, updateBalanceAndAddTransaction } =
  AccountSlice.actions;
const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    isLoading: LoaderSlice.reducer,
    tabIndex: TabSlice.reducer,
    accountData: AccountSlice.reducer,
  },
});

export default store;

export const user = (state: StateProps) => state.user;
export const isLoading = (state: StateProps) => state.isLoading;
export const tabIndex = (state: StateProps) => state.tabIndex;
export const accountDataa = (state: StateProps) => state.accountData;
