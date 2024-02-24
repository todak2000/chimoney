import { render, fireEvent, act, screen } from "@testing-library/react";
import Button from "@/app/components/Button/Button";
import { Provider, useSelector } from "react-redux";
import store from "@/app/store";
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

jest.mock("@/app/api/auth", () => ({
  handleGoogleAuth: jest
    .fn()
    .mockResolvedValue({ status: 200, message: "Success" }),
}));

describe("Button", () => {
  const props = {
    title: "Sign in with Google",
  };

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Button {...props} />
          </QueryClientProvider>
        </Provider>
      );
    });
    expect(await screen.findByText("Sign in with Google")).toBeInTheDocument();
  });
});
