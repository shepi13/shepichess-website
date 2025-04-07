import { useState } from "react";

/**
 * Simple Toggle react hook
 *
 * @param initialVal - value the toggle should start with
 * @returns [val, toggle] - react boolean state and function that can be used to toggle the value
 */
export function useToggle(initialVal: boolean): [boolean, () => void] {
  const [flipped, setFlipped] = useState(initialVal);
  return [
    flipped,
    () => {
      setFlipped((prev) => !prev);
    },
  ];
}
