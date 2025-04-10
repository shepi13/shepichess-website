import { act, getByRole } from "@testing-library/react";

import {
  ChessBoardIcon,
  ChessBoardIconSquareCount,
} from "@/components/ChessBoardIcon";

import { container, root } from "@/lib/test/componentTestHelpers";

describe("Test Background Filter SVG", () => {
  test.each([2, 3, 4, 6, 8])("Contains svg icon", (size) => {
    act(() =>
      root.render(
        <ChessBoardIcon numSquares={size as ChessBoardIconSquareCount} />,
      ),
    );

    const svg = getByRole(container, "img");
    expect(svg).toBeInTheDocument();
    expect(svg.querySelector("desc")).toBeInTheDocument();
  });
});
