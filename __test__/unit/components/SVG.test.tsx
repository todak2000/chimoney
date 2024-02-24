import { render } from "@testing-library/react";

import DarkModeIcon from "@/app/svgs/DarkModeIcon";
import LightModeIcon from "@/app/svgs/LightModeIcon";

describe("Darkmode Icon", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DarkModeIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("LightMode Icon", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LightModeIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});
