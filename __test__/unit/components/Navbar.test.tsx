import { render, act, screen } from "@testing-library/react";
import { Provider, useSelector } from "react-redux";
import store from "@/app/store";
import NavBar from "@/app/components/NavBar/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const queryClient = new QueryClient();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
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
  const mockNoUser = {
    name: "",
    email: "",
    accountNo: "",
    phone: "",
    photo: "",
    prefferedCurrency: "USD",
  };

  it("renders without crashing with no user", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user: mockNoUser, isLoading: false });
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <NavBar />
          </QueryClientProvider>
        </Provider>
      );
    });
    const textLinks = ["Integration", "Download", "Pricing"];

    textLinks.forEach(async (title: string) => {
      expect(await screen.findByText(title)).toBeInTheDocument();
    });

    expect(await screen.findByTestId("logo")).toBeInTheDocument();
    expect(await screen.findAllByTestId("link")).toHaveLength(3);
  });

  it("renders without crashing with user", async () => {
    (useSelector as unknown as jest.Mock).mockImplementation((callback) => {
      return callback({ user: mockUser, isLoading: false });
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <NavBar />
          </QueryClientProvider>
        </Provider>
      );
    });
    const textLinks = ["Dashboard", "Integration", "Download", "Pricing"];

    textLinks.forEach(async (title: string) => {
      expect(await screen.findByText(title)).toBeInTheDocument();
    });

    expect(await screen.findByTestId("user")).toBeInTheDocument();
    expect(await screen.findByTestId("logout")).toBeInTheDocument();
    expect(await screen.findAllByTestId("link")).toHaveLength(4);
  });
});
