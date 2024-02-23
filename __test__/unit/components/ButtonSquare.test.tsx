import { render, fireEvent } from "@testing-library/react";
import ButtonSquare from "@/app/components/Button/ButtonSquare";

describe("ButtonSquare", () => {
  const mockOnClick = jest.fn();
  const props = {
    title: "Test Button",
    icon: <div>Icon</div>,
    onClick: mockOnClick,
    loading: false,
    className: "test-class",
  };

  it("renders without crashing", () => {
    const { getByText } = render(<ButtonSquare {...props} />);
    expect(getByText("Test Button")).toBeInTheDocument();
  });

  it("handles button click", () => {
    const { getByText } = render(<ButtonSquare {...props} />);
    const button = getByText("Test Button");

    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  });
});
