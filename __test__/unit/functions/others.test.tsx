import { UserProps } from "@/app/constants/types";
import { onSubmit, getKeyName } from "@/app/lib/others";

import { showToastError } from "@/app/lib/toast";
import { useSelector } from "react-redux";

jest.mock("@/app/lib/toast", () => ({
  showToastError: jest.fn(),
  showToastSuccess: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("onSubmit function", () => {
  it("should call showToastError when trying to send funds to same wallet or email", async () => {
    const values = { receiverID: "123", email: "test@test.com", amount: 10 };
    const userr = {
      accountNo: "123",
      email: "test@test.com",
      prefferedCurrency: "USD",
    };
    const userBalance = { chi: 20 };
    const submitFn = jest.fn();
    const setEmail = jest.fn();
    const setName = jest.fn();
    const setBanks = jest.fn();
    const setBranches = jest.fn();
    const dispatch = jest.fn();
    const currentExchangeRate = () => 1;
    const resetForm = jest.fn();
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ userr });
    });
    await onSubmit(
      values,
      resetForm,
      "Send Fund",
      userr,
      userBalance,
      showToastError,
      submitFn,
      setEmail,
      setName,
      currentExchangeRate,
      setBanks,
      setBranches,
      dispatch
    );

    expect(showToastError).toHaveBeenCalledWith(
      `Oops! you can't send money  to same wallet. Please enter a different wallet ID`
    );
  });

  // Add more tests for other conditions in the onSubmit function
});

describe("getKeyName function", () => {
  it("should return correct name for given key", () => {
    const key = "accountNo";
    const userr: UserProps = {
      accountNo: "123",
      email: "test@test.com",
      prefferedCurrency: "USD",
      name: "name",
      photo: "wsfs",
      uid: "23232",
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ userr });
    });

    const result = getKeyName(key, userr);

    expect(result).toEqual("Wallet ID");
  });
});
