import { act, getByRole } from "@testing-library/react";

import { Header } from "@/components/mainLayout/Header";

import { container, root } from "@/lib/test/componentTestHelpers";

import { navLinks } from "@/data/navLinks";

// We have to mock this for the theme toggle react-ui to work
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Test Nav Bar", () => {
  test("Renders Logo", () => {
    act(() => root.render(<Header />));

    const logo = getByRole(container, "img");
    const homeLink = getByRole(container, "link", { name: "shepichess" });
    expect(logo).toHaveAttribute("src", "/logo.svg");
    expect(logo.parentElement).toBe(homeLink);
    expect(logo).toHaveAttribute("alt");
  });

  test.each(navLinks)("Renders Links", ({ href, title }) => {
    act(() => root.render(<Header />));

    const element = getByRole(container, "link", { name: title });
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("href", href);
  });

  test.each(navLinks)(
    "Show/Hide links when mobile button is clicked",
    ({ title }) => {
      act(() => root.render(<Header />));

      let element = getByRole(container, "link", { name: title });
      expect(element.parentElement).toHaveClass("hidden");

      const button = getByRole(container, "button", {
        name: "Show Mobile Links",
      });
      expect(button).toBeDefined();

      act(() => button.click());
      element = getByRole(container, "link", { name: title });
      expect(element.parentElement).not.toHaveClass("hidden");
    },
  );
});
