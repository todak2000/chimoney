/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable import/no-extraneous-dependencies */

import { act, render, screen } from "@testing-library/react";

import TransactionTable from "@/app/components/Table/TransactionTable";
import store from "@/app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useSelector } from "react-redux";
import { TransactionsProps, UserProps } from "@/app/constants/types";
import { faker } from "@faker-js/faker";
import moment from "moment";
const queryClient = new QueryClient();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

export const generateFakeTransactionData = () => {
  const data: TransactionsProps[] = [];
  for (let i: number = 0; i < 6; i += 1) {
    data.push({
      description: faker.lorem.sentence(),
      date: moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss"),
      amount: faker.number.int({ min: 1, max: 99 }),
      type: faker.helpers.arrayElement(["Credit", "Debit"]),
      wallet: faker.helpers.arrayElement(["chi", "momo", "airtime"]),
    });
  }

  return data;
};

describe("Transaction Table Component", () => {
  it("renders without crashing", async () => {
    const user: UserProps = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      photo: faker.internet.avatar(),
      uid: faker.lorem.word(),
      phone: faker.phone.number(),
      accountNo: faker.phone.number(),
      prefferedCurrency: "USD",
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user });
    });
    const transactionData: TransactionsProps[] = generateFakeTransactionData();
    const isPending = false;
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <TransactionTable
              transactionData={transactionData}
              isPending={isPending}
            />
          </QueryClientProvider>
        </Provider>
      );
    });
    const titleCount = await screen.findByTestId("title");
    const tableHeaderCount = await screen.findAllByTestId("table-header");
    const table = await screen.findByTestId("table");

    expect(titleCount).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(tableHeaderCount).toHaveLength(6);

    const dataCount = screen.getAllByTestId("table-row");
    expect(dataCount).toHaveLength(6);
  });
});
