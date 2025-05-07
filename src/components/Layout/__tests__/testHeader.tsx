import { act, fireEvent, getByRole, screen } from "@testing-library/react";

import { Header } from "@/components/Layout/Header";

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

  test("Renders small screen", () => {
    act(() => {
      root.render(<Header />);
      window = Object.assign(window, { innerWidth: 500 });
      fireEvent(window, new Event("resize"));
    });

    const header = getByRole(container, "banner");
    expect(header).toBeInTheDocument();
  });

  test.each(navLinks)("Renders Links", async ({ href, title, sublinks }) => {
    act(() => root.render(<Header />));

    if (!sublinks) {
      const element = getByRole(container, "link", { name: title });
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute("href", href);
    } else {
      const element = getByRole(container, "button", { name: title });
      expect(element).toBeInTheDocument();
      await act(async () => fireEvent.click(element));

      for (const link of sublinks) {
        const sublinkElem = screen.getByRole("menuitem", { name: link.title });
        expect(sublinkElem).toBeInTheDocument();
        expect(sublinkElem).toHaveAttribute("href", link.href);

        await act(async () =>
          fireEvent.keyDown(sublinkElem, {
            key: "ArrowDown",
            code: "ArrowDown",
            charCode: 40,
          }),
        );
        expect(sublinkElem).toHaveClass("bg-secondary");
      }
    }
  });

  test.each(navLinks)(
    "Show/Hide links when mobile button is clicked",
    ({ title, sublinks }) => {
      act(() => root.render(<Header />));

      const role = sublinks ? "button" : "link";
      let element = getByRole(container, role, { name: title });
      expect(element.parentElement).toHaveClass("hidden");

      const button = getByRole(container, "button", {
        name: "Show Mobile Links",
      });
      expect(button).toBeDefined();

      act(() => button.click());
      element = getByRole(container, role, { name: title });
      expect(element.parentElement).not.toHaveClass("hidden");
    },
  );
});
