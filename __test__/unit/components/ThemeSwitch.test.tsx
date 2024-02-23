/* eslint-disable import/no-extraneous-dependencies */
import { act, render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";

import ThemeSwitch from "@/app/components/ThemeSwitch";

jest.mock("next-themes", () => ({
  ...jest.requireActual("next-themes"),
  useTheme: jest.fn(),
}));

describe("ThemeSelector Component", () => {
  it("renders without crashing as light theme", async () => {
    const theme: string = "light";
    const setTheme = jest.fn();

    (useTheme as jest.Mock).mockImplementation(() => ({ theme, setTheme }));
    await act(async () => {
      render(<ThemeSwitch />);
    });
    const lightThemeButton = screen.getByTestId("light-theme-button");
    const darkThemeButton = screen.getByTestId("dark-theme-button");
    expect(lightThemeButton).toBeInTheDocument();
    expect(darkThemeButton).toBeInTheDocument();
  });

  it("renders without crashing as dark theme", async () => {
    const theme: string = "dark";
    const setTheme = jest.fn();

    (useTheme as jest.Mock).mockImplementation(() => ({ theme, setTheme }));
    await act(async () => {
      render(<ThemeSwitch />);
    });
    const lightThemeButton = screen.getByTestId("light-theme-button");
    const darkThemeButton = screen.getByTestId("dark-theme-button");
    expect(lightThemeButton).toBeInTheDocument();
    expect(darkThemeButton).toBeInTheDocument();
  });
});
