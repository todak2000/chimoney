import { render, screen } from "@testing-library/react";

import SkeletonLoader from "@/app/components/SkeletonLoader";

describe("Skeleton Loader Component", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SkeletonLoader />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders grid type without crashing", () => {
    render(<SkeletonLoader type="grid" count={5} />);
    const gridWrapper = screen.getAllByTestId("grid-wrapper");
    expect(gridWrapper).toHaveLength(1);
    const grids = screen.getAllByTestId("grid");
    expect(grids).toHaveLength(5);
  });

  it("renders block type without crashing", () => {
    render(<SkeletonLoader type="block" count={5} />);
    const blockWrapper = screen.getAllByTestId("block-wrapper");
    expect(blockWrapper).toHaveLength(1);

    const blocks = screen.getAllByTestId("block");
    expect(blocks).toHaveLength(5);
  });

  it("renders star type without crashing", () => {
    render(<SkeletonLoader type="star" count={5} />);
    const starWrapper = screen.getAllByTestId("star-wrapper");
    expect(starWrapper).toHaveLength(1);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);
  });
});
