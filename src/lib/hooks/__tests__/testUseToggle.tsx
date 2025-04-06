import { describe, test, expect } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import useToggle from "../useToggle";

describe("Hooks/useToggle", () => {
    test.each([true, false])("Toggle", (initVal) => {
        const { result } = renderHook(() => useToggle(initVal));
        expect(result.current[0]).toBe(initVal);

        act(() => result.current[1]());
        expect(result.current[0]).toBe(!initVal);
    });
});
