import { render, act, screen } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import store from "@/app/store";
import Header from "@/app/components/NavBar/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const queryClient = new QueryClient();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other router properties you need
  }),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("Header", () => {
  const mockUser = {
    name: "Test User",
    email: "testuser@example.com",
    accountNo: "1234567890",
    phone: "1234567890",
    photo: "https://example.com/photo.jpg",
    prefferedCurrency: "USD",
  };

  it("renders without crashing", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user: mockUser, tabIndex: 0 });
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Header />
          </QueryClientProvider>
        </Provider>
      );
    });

    expect(await screen.findByText("Overview")).toBeInTheDocument();
    expect(await screen.findByText("Transactions")).toBeInTheDocument();
    expect(await screen.findByTestId("logo")).toBeInTheDocument();
    expect(await screen.findByTestId("logout")).toBeInTheDocument();
  });
});
