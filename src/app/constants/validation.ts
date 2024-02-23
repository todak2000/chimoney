import * as Yup from "yup";

export const LinkSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email address provided is Invalid!")
    .required("Email address is required!"),
  amount: Yup.number()
    .min(1, "Amount cannot be less than 1!")
    .positive("Amount must be a positive number!")
    .required("Amount is required!"),
});

export const SendSchema = Yup.object().shape({
  receiverID: Yup.string()
    .length(36, "Recipient Wallet ID address must be exactly 36 characters!")
    .required("Recipient Wallet ID address is required!"),
  amount: Yup.number()
    .min(1, "Amount cannot be less than 1!")
    .positive("Amount must be a positive number!")
    .required("Amount is required!"),
});
export const BankSchema = Yup.object().shape({
  country: Yup.string().required("Country is required!"),
  amount: Yup.number()
    .min(1, "Amount cannot be less than 1!")
    .positive("Amount must be a positive number!")
    .required("Amount is required!"),
  bank: Yup.string().required("Bank is required!"),
  accountNumber: Yup.string()
    .required("Account Number is required!")
    .min(10, "Account Number cannot be less than 10 digits")
    .max(13, "Account Number cannot be more than 13 digits")
    .test(
      "countries",
      "Account Number must be exactly 10 digits for Nigeria",
      function (value) {
        const { country } = this.parent;
        return value
          ? country === "Nigeria"
            ? value.length === 10
            : true
          : false;
      }
    ),
});
