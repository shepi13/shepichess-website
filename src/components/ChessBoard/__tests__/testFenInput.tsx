import { toastError } from "./mocks/mockToast";

import { getByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { act } from "react";

import { container, root } from "@/lib/test/componentTestHelpers";

import { FenInput } from "../FenInput";

let currentFen = "";
const updateFen = jest.fn((fen) => {
  currentFen = fen;
});

const validFen =
  "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6";

describe("Test FenInput Component", () => {
  test("Test Invalid Fen", async () => {
    const user = userEvent.setup();
    act(() => root.render(<FenInput onSubmit={updateFen} />));

    const inputElem = getByRole(container, "textbox", { name: "Input Fen" });
    const submitElem = getByRole(container, "button", { name: "Submit Fen" });

    await user.clear(inputElem);
    await user.type(inputElem, "INVALID");
    await user.click(submitElem);

    expect(toastError).toHaveBeenCalled();
    expect(updateFen).not.toHaveBeenCalled();
    expect(currentFen).toBe("");
  });

  test("Test Valid Fen", async () => {
    const user = userEvent.setup();
    act(() => root.render(<FenInput onSubmit={updateFen} />));

    const inputElem = getByRole(container, "textbox", { name: "Input Fen" });
    const submitElem = getByRole(container, "button", { name: "Submit Fen" });

    await user.clear(inputElem);
    await user.type(inputElem, validFen);
    await user.click(submitElem);

    expect(toastError).not.toHaveBeenCalled();
    expect(updateFen).toHaveBeenCalled();
    expect(currentFen).toBe(validFen);
  });
});
