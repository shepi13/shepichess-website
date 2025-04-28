import { useEffect, useState } from "react";

/**
 * Type for tracking the current size of the window for responsive javascript
 * (Tailwind classes should be used for responsive css)
 *
 * @property width - Width of window
 * @property height - Height of window
 *
 */
export type WindowSize = {
  width: number;
  height: number;
} | null;

/**
 *
 * Custom hook to track the current window size in react state. Allows responsive JSX/Javascript
 * to handle different screen sizes if necessary.
 *
 * Tailwind classes should be preffered to this hook if possible.
 *
 * @returns WindowSize (current window size, or null if component isn't mounted yet.)
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(null);

  useEffect(() => {
    setWindowSize(getWindowSize());
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

function getWindowSize(): WindowSize {
  return (({ innerWidth: width, innerHeight: height }) => ({ width, height }))(
    window,
  );
}
