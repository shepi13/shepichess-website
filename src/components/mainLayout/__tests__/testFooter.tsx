import { act, getByRole } from "@testing-library/react";

import { Footer } from "@/components/mainLayout/Footer";
import { container, root } from "@/lib/test/componentTestHelpers";

describe("Test Footer", () => {
  test("Contains Copyright", () => {
    act(() => root.render(<Footer />));


    const copyright = getByRole(container, "paragraph", {name: "Copyright"});
    expect(copyright).toBeInTheDocument();
    expect(copyright.innerHTML.toLowerCase().includes("copyright")).toBe(true);
  });

  test("Contains Location", () => {
    act(() => root.render(<Footer />));

    const location = getByRole(container, "paragraph", {name: "Location"});
    expect(location).toBeInTheDocument();
    expect(location.innerHTML.toLowerCase().includes("flowood")).toBe(true);
  });
});
