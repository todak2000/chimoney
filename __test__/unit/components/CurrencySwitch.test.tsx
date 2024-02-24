import { act, render, screen } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import store from "@/app/store";
import Hero from "@/app/components/Hero/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import CurrencySwitch from "@/app/components/NavBar/CurrencySwitch";
const queryClient = new QueryClient();

jest.mock("@lottiefiles/react-lottie-player", () => ({
  ...jest.requireActual("@lottiefiles/react-lottie-player"),
  Player: () => <div data-testid="lottie">Mock Lottie Player</div>,
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other router properties you need
  }),
}));
describe("CurrencySwitch", () => {
  // Mock the useSelector hook

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
      return callback({ user: mockUser, isLoading: false });
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <CurrencySwitch />
          </QueryClientProvider>
        </Provider>
      );
    });
    const textLinks = ["USD", "NGN"];

    textLinks.forEach(async (title: string) => {
      expect(await screen.findByText(title)).toBeInTheDocument();
    });
  });
});
