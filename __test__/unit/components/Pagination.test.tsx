import { render, fireEvent } from "@testing-library/react";
import Pagination from "@/app/components/Table/Pagination";
import { PaginationProps } from "@/app/constants/types";
import { generateFakeTransactionData } from "./TransactionTable.test";
describe("Pagination", () => {
  const mockSetCurrentData = jest.fn();
  const props: PaginationProps = {
    data: generateFakeTransactionData(),
    itemsPerPage: 3,
    setCurrentData: mockSetCurrentData,
    value: "CHI",
  };

  it("renders without crashing", () => {
    const { getByText } = render(<Pagination {...props} />);
    expect(getByText("Showing 1 to 3 of 6 Entries")).toBeInTheDocument();
  });

  it('handles "Next" and "Prev" button clicks', () => {
    const { getByText } = render(<Pagination {...props} />);
    const nextButton = getByText("Next");
    const prevButton = getByText("Prev");

    // Initial state
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Click "Next"
    fireEvent.click(nextButton);
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    expect(getByText("Showing 4 to 6 of 6 Entries")).toBeInTheDocument();

    // Click "Prev"
    fireEvent.click(prevButton);
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    expect(getByText("Showing 4 to 6 of 6 Entries")).toBeInTheDocument();
  });
});
