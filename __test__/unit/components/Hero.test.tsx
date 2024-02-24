import { act, render, screen } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import store from "@/app/store";
import Hero from "@/app/components/Hero/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const queryClient = new QueryClient();

jest.mock("@lottiefiles/react-lottie-player", () => ({
  ...jest.requireActual("@lottiefiles/react-lottie-player"),
  Player: () => <div data-testid="lottie">Mock Lottie Player</div>,
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other router properties you need
  }),
}));
describe("Hero", () => {
  // Mock the useSelector hook

  const mockUser = {
    name: "Test User",
    email: "testuser@example.com",
    accountNo: "1234567890",
    phone: "1234567890",
    photo: "https://example.com/photo.jpg",
    prefferedCurrency: "USD",
  };
  const mockNoUser = {
    name: "",
    email: "",
    accountNo: "",
    phone: "",
    photo: "",
    prefferedCurrency: "USD",
  };

  it("renders without crashing no user", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user: mockNoUser, isLoading: false });
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Hero />
          </QueryClientProvider>
        </Provider>
      );
    });
    const textLinks = [
      "Your Financial Goals, Our Expertise",
      "With our Innovative finaincial tools and expert guidance, you can be confident in your financial decisions and achieve your goals.",
    ];

    textLinks.forEach(async (title: string) => {
      expect(await screen.findByText(title)).toBeInTheDocument();
    });

    expect(await screen.findByTestId("lottie")).toBeInTheDocument();
  });
  it("renders without crashing with user", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user: mockUser, isLoading: false });
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Hero />
          </QueryClientProvider>
        </Provider>
      );
    });
    const textLinks = [
      "Your Financial Goals, Our Expertise",
      "With our Innovative finaincial tools and expert guidance, you can be confident in your financial decisions and achieve your goals.",
      "Get started with",
    ];

    textLinks.forEach(async (title: string) => {
      expect(await screen.findByText(title)).toBeInTheDocument();
    });
    expect(await screen.findByTestId("lottie")).toBeInTheDocument();
  });
});
