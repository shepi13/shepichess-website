import { act, fireEvent, renderHook } from "@testing-library/react";

import { useWindowSize } from "../useWindowSize";

describe("Test hooks/useWindowSize", () => {
  test("Test default window", () => {
    window = Object.assign(window, { innerWidth: 500, innerHeight: 1000 });
    const { result } = renderHook(useWindowSize);
    expect(result.current).not.toBeNull();
    expect(result.current?.width).toBe(500);
    expect(result.current?.height).toBe(1000);
  });

  test("Test resize window", () => {
    const { result } = renderHook(useWindowSize);

    window = Object.assign(window, { innerWidth: 500, innerHeight: 1000 });
    act(() => fireEvent(window, new Event("resize")));
    expect(result.current?.width).toBe(500);
    expect(result.current?.height).toBe(1000);
  });
});
