import { act, getByRole } from "@testing-library/react";

import { container, root } from "@/components/__tests__/componentTestHelpers";

import { PGNButtonSettings } from "@/lib/types/types";

import { PGNViewerButtons } from "../PGNViewerButtons";

describe("Test PGNViewerButtons Component", () => {
  let leftButton: PGNButtonSettings, rightButton: PGNButtonSettings;
  let leftButtonElement: HTMLElement, rightButtonElement: HTMLElement;

  beforeEach(() => {
    leftButton = { onClick: jest.fn(), disabled: false, children: "Left" };
    rightButton = { ...leftButton, children: "Right" };

    act(() =>
      root.render(
        <PGNViewerButtons
          leftButtons={[leftButton]}
          rightButtons={[rightButton]}
          leftButtonStyle="left"
          rightButtonStyle="right"
        />,
      ),
    );

    leftButtonElement = getByRole(container, "button", { name: "Left" });
    rightButtonElement = getByRole(container, "button", { name: "Right" });
  });
  test("Test Buttons Render", () => {
    expect(leftButtonElement).toBeDefined();
    expect(rightButtonElement).toBeDefined();
  });
  test("Test Buttons styled", () => {
    expect(leftButtonElement.className.includes("left")).toBe(true);
    expect(rightButtonElement.className.includes("right")).toBe(true);
  });
  test("Test Buttons Click", () => {
    expect(leftButton.onClick).not.toHaveBeenCalled();
    expect(rightButton.onClick).not.toHaveBeenCalled();
    act(() => leftButtonElement.click());
    act(() => rightButtonElement.click());
    expect(leftButton.onClick).toHaveBeenCalled();
    expect(rightButton.onClick).toHaveBeenCalled();
  });

  test("Test Buttons Default Buttons", () => {
    act(() =>
      root.render(
        <PGNViewerButtons
          leftContainerStyle="left-test"
          rightContainerStyle="right-test"
        />,
      ),
    );

    expect(container.querySelector(".left-test")?.childElementCount).toEqual(0);
    expect(container.querySelector(".right-test")?.childElementCount).toEqual(
      0,
    );
  });
});
