/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import { StateProps, UserProps } from "@/app/constants/types";
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

// User slice
const UserSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser: (
      state: UserProps,
      action: PayloadAction<Omit<UserProps, "prefferedCurrency">>
    ) => {
      console.log(action.payload, "payload");
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
export const { setUser, clearUser, updateCurrency } = UserSlice.actions;
export const { setIsLoading } = LoaderSlice.actions;
export const { setTabIndex } = TabSlice.actions;

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    isLoading: LoaderSlice.reducer,
    tabIndex: TabSlice.reducer,
  },
});

export default store;

export const user = (state: StateProps) => state.user;
export const isLoading = (state: StateProps) => state.isLoading;
export const tabIndex = (state: StateProps) => state.tabIndex;
