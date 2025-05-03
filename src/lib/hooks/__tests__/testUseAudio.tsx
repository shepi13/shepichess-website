import { renderHook } from "@testing-library/react";

import { useAudio } from "../useAudio";

describe("Test hooks/useAudio", () => {
  test("Test audio cached", () => {
    const { result: result1 } = renderHook(() => useAudio("testSRC"));
    const { result: result2 } = renderHook(() => useAudio("testSRC"));

    expect(result1.current).toBe(result2.current);
  });

  test("Test audio object", () => {
    const { result } = renderHook(() => useAudio("/testSRC"));
    expect(result.current).toBeInstanceOf(HTMLAudioElement);
    expect(result.current?.src.endsWith("/testSRC")).toBe(true);
    expect(result.current?.paused).toBe(true);
  });
});
