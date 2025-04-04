import { act } from "@testing-library/react";
import { createRoot, Root } from "react-dom/client";

export let root : Root, container: HTMLDivElement;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  act(() => root = createRoot(container));
});

afterEach(() => {
  container.remove();
});