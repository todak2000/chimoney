import { render, fireEvent, act, screen } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import store from "@/app/store";
import Profile from "@/app/components/Profile/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { UserProps } from "@/app/constants/types";
const queryClient = new QueryClient();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("Profile", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", async () => {
    const user: UserProps = {
      name: "Test User",
      email: "testuser@example.com",
      photo: faker.internet.avatar(),
      uid: faker.lorem.word(),
      phone: "1234567890",
      accountNo: "12345678901",
      prefferedCurrency: "USD",
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user });
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Profile />
          </QueryClientProvider>
        </Provider>
      );
    });

    const nameCount = await screen.findAllByText("Test User");
    const emailCount = await screen.findAllByText("testuser@example.com");
    const accountNo = await screen.findByTestId("accountNo");
    const phone = await screen.findByTestId("phone");
    expect(nameCount).toHaveLength(1);
    expect(emailCount).toHaveLength(1);
    expect(accountNo).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
  });

  it('handles "Edit" and "Delete" button clicks', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Profile />
          </QueryClientProvider>
        </Provider>
      );
    });

    const editButton = await screen.findByText("Edit");
    const deleteButton = await screen.findByText("Delete");
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
});
