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

export const SigninSchema = Yup.object({
  email: Yup.string()
    .email("Email address must be valid")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
      "Password must contain at least one of A-Z, a-z, 0-9 and a special character."
    )
    .required("Password is required"),
});

export const SignupSchema = Yup.object({
  name: Yup.string()
    .min(3, "Must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Email address must be valid")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
      "Password must contain at least one of A-Z, a-z, 0-9 and a special character."
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
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
