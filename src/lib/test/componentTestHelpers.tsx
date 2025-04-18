import { act } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mockAnimationsApi } from "jsdom-testing-mocks";
import { Root, createRoot } from "react-dom/client";

mockAnimationsApi();

export let root: Root, container: HTMLDivElement;

beforeEach(() => {
  // Mock window.watchmedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  act(() => (root = createRoot(container)));
});

afterEach(() => {
  container.remove();
});
