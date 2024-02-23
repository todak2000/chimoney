/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable import/no-extraneous-dependencies */

import { act, render, screen } from "@testing-library/react";
import Overview from "@/app/components/Overview/Overview";
import store from "@/app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useSelector } from "react-redux";
import { AccProps, UserProps } from "@/app/constants/types";
import { faker } from "@faker-js/faker";
import { key } from "@/app/lib/uniqueKey";
const queryClient = new QueryClient();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("@tremor/react", () => ({
  ...jest.requireActual("@tremor/react"),
  AreaChart: () => <div data-testid="mockAreaChart">Mock AreaChart</div>,
}));
export const generateFakeAccountData = () => {
  const data: AccProps[] = [];
  for (let i: number = 0; i < 3; i += 1) {
    data.push({
      id: key(),
      balance: 1000,
      owner: key(),
      transactions: [],
      type: ["chi", "momo", "airtime"].filter((x, index) => index === i)[0],
    });
  }

  return data;
};

describe("Overview Component", () => {
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
    const accountData: AccProps[] = generateFakeAccountData();
    const currentExchangeRate = jest.fn().mockReturnValue(1550.34);
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Overview
              accountData={accountData}
              isPending={false}
              chatData={[]}
              currentExchangeRate={currentExchangeRate}
            />
          </QueryClientProvider>
        </Provider>
      );
    });

    const textLinks = ["Chi Balance", "MoMo", "Airtime"];

    textLinks.forEach(async (title: string) => {
      expect(await screen.findByText(title)).toBeInTheDocument();
    });

    const cardCount = await screen.findAllByTestId("card");
    expect(cardCount).toHaveLength(3);

    const addButton = screen.getByText("Add Money");
    const sendButton = screen.getByText("Send Money");

    // Initial state
    expect(addButton).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
    expect(await screen.findByTestId("mockAreaChart")).toBeInTheDocument();
  });
});
