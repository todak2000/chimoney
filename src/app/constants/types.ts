import { FieldProps } from "formik";
import { ReactElement, ReactNode } from "react";

export interface SvgProps {
  className?: string;
}

export interface INavBar {
  id: string;
  text: string;
  url?: string;
  callback?: () => void;
}
export interface OnboardingProps {
  email: string;
  password: string;
  name?: string;
}
export interface ButtArrProps {
  id: string;
  title: string;
  icon: ReactElement;
  onClick: () => void;
  loading: boolean;
  className: string;
}

export type TransactionsProps = {
  amount: number;
  balanceBefore?: number;
  description: string;

  meta?: {
    date: {
      _seconds: number;
      _nanoseconds: number;
    };
  };
  newBalance?: number;
  date?: string;
  type?: string;
  wallet?: string;
};
export interface AccProps {
  id: string;
  balance: number;
  owner: string;
  transactions: TransactionsProps[];
  type: string;
}

export interface OverviewProps {
  accountData: AccProps[];
  chatData: ChartResultProps[];
  isPending: boolean;
  currentExchangeRate: () => number;
}

export interface PaymentOptionsProps {
  id: string;
  option: string;
  icon: ReactElement | null;
  callBack: () => void;
  description: string;
  isPopular: boolean;
}

export type ModalType = "credit" | "debit" | "";

export interface SelectModalProps {
  open: ModalType;
  type: string;
  header: string;
  options: PaymentOptionsProps[];
  subHeader: string;
  next: string;
  currentExchangeRate: () => number;
  setNext: React.Dispatch<React.SetStateAction<string>>;
  setOpen: Function;
}

export type finalFormDataProps = {
  paymentId: string;
  amount: number;
  email?: string;
  link?: string;
  chiRef?: string | null;
  payee?: string | null;
  paymentLink?: string | null;
  paymentStatus?: string | null;
  paymentRef?: string | null;
};

export interface TransactionViewProps {
  transactionData: TransactionsProps[];
  isPending: boolean;
}

export type ChartResultProps = {
  date: string;
  [key: string]: string | number;
} | null;

export type CountryProps = {
  name: string;
  code: string;
  flag?: null | string;
  id?: number;
};

export type SelectInputProps = FieldProps & {
  options: CountryProps[];
  onSelect: (value: string) => void;
};

export type FormData = {
  [key: string]: string | number | undefined | object;
}[];

export interface FinalModalProps {
  data: finalFormDataProps;
  subHeader: string;
  currentExchangeRate: () => number;
  backFn: () => void;
}

export interface FormProps {
  data: FormData;
  schema: any;
  subHeader: string;
  currentExchangeRate: () => number;
  backFn: () => void;
  loading: boolean;
  userBalance?: { chi: number; momo: number; airtime: number } | null;
  submitFn: (data: any) => void;
}
export interface PaymentLinkProps {
  meta: {
    isRedirectFromChimoney: string;
  };
  valueInUSD: number;
  payerEmail: string;
  redirect_url: string;
}
export interface ButtonProps {
  data: ChartResultProps[];
}
export interface GoogleButtonProps {
  title: string;
}
export interface ButtonSquareProps {
  title: string;
  icon: ReactElement;
  onClick: () => void;
  loading: boolean;
  className: string;
}

export interface LayoutType {
  children?: ReactNode;
}

export interface UserProps {
  name: string;
  email: string;
  photo: string;
  uid: string;
  phone?: string;
  accountNo: string;
  prefferedCurrency?: "USD" | "NGN";
}

export type StateProps = {
  open: boolean;
  isLoading: boolean;
  user: UserProps;
  tabIndex: number;
  accountData: AccProps[];
};

export interface PaginationProps {
  data: TransactionsProps[];
  itemsPerPage: number;
  setCurrentData: React.Dispatch<React.SetStateAction<TransactionsProps[]>>;
  value: string;
}
export type ISignup = {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  meta: {
    userId: string; //google uid
  };
};
export interface OptionListProps {
  options: PaymentOptionsProps[];
  subHeader: string;
}

export interface LogoutModalProps {
  open: boolean;
  text: string;
  loading?: boolean;
  callBack: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ModalWrapperProps {
  openModal: ModalType;
  setOpenModal: React.Dispatch<React.SetStateAction<ModalType>>;
  next: string;
  currentExchangeRate: () => number;
  accountData: AccProps[] | null;
  setNext: React.Dispatch<React.SetStateAction<string>>;
}
