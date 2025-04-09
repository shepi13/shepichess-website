import { act } from "@testing-library/react";

import { SVGGrainyFilter } from "@/components/mainLayout/BackgroundFilter";

import { container, root } from "@/lib/test/componentTestHelpers";

describe("Test Background Filter SVG", () => {
  test("Contains #grainy filter", () => {
    act(() => root.render(<SVGGrainyFilter />));

    const svg = container?.querySelector("svg");
    const filter = container?.querySelector("filter#grainy");
    expect(filter).toBeDefined();
    expect(svg).toContainElement(filter as HTMLElement);
  });
});
