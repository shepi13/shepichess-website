import { fireEvent, getByRole, screen } from "@testing-library/dom";
import { act } from "@testing-library/react";

import { container, root } from "@/lib/test/componentTestHelpers";

import { ThemeProvider } from "../ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";

// We have to mock this for the theme toggle react-ui to work
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Test Theme Toggle", () => {
  test("Test options hidden by default", async () => {
    act(() => root.render(<ThemeToggle />));
    // links should be inaccessable before button is pressed
    expect(() => screen.getByRole("menuitem")).toThrow();
  });

  test("Test select dark mode", async () => {
    act(() =>
      root.render(
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeToggle />
        </ThemeProvider>,
      ),
    );
    let button = getByRole(container, "button", { name: "Choose Theme" });
    await act(async () => {
      fireEvent.click(button);
    });

    const dark = screen.getByRole("menuitem", { name: "Dark" });
    await act(async () => {
      fireEvent.click(dark);
    });
    button = getByRole(container, "button", { name: "Choose Theme" });
    expect(button.innerHTML.toLowerCase().startsWith("dark mode")).toBe(true);
  });

  test("Test select light mode", async () => {
    act(() =>
      root.render(
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeToggle />
        </ThemeProvider>,
      ),
    );
    let button = getByRole(container, "button", { name: "Choose Theme" });
    await act(async () => {
      fireEvent.click(button);
    });

    const light = screen.getByRole("menuitem", { name: "Light" });
    await act(async () => {
      fireEvent.click(light);
    });
    button = getByRole(container, "button", { name: "Choose Theme" });
    expect(button.innerHTML.toLowerCase().startsWith("light mode")).toBe(true);
  });

  test("Test focus highlight", async () => {
    act(() =>
      root.render(
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeToggle />
        </ThemeProvider>,
      ),
    );
    const button = getByRole(container, "button", { name: "Choose Theme" });
    await act(async () => {
      fireEvent.click(button);
    });

    let light = screen.getByRole("menuitem", { name: "Light" });
    await act(async () => {
      fireEvent.mouseOver(light);
    });
    light = screen.getByRole("menuitem", { name: "Light" });
    // A new background class should be set
    expect(light.className.includes("bg-")).toBeTruthy();
  });
});
