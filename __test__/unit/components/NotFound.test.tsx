/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable import/no-extraneous-dependencies */

import { render, screen } from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("Not Found Component", () => {
  it("should render without crashing", () => {
    render(<NotFound />);

    const textLinks = ["Page Not Found", "Back to home"];

    textLinks.forEach((title: string) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();
  });
});
