import { render } from "@testing-library/react";
import Loader from "@/app/components/loader/Loader";

describe("Loader", () => {
  it("renders without crashing", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass("animate-spin");
  });
});
