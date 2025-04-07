import { act } from "@testing-library/react";
import { root, container } from "./componentTestHelpers";
import SVGGrainyFilter from "../BackgroundFilter";

describe("Test Background Filter SVG", () => {
  test("Contains #grainy filter", () => {
    act(() => root.render(<SVGGrainyFilter />));

    const svg = container?.querySelector("svg");
    const filter = container?.querySelector("filter#grainy");
    expect(filter).toBeDefined();
    expect(svg).toContainElement(filter as HTMLElement);
  });
});
