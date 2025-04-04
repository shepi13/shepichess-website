import { act } from "@testing-library/react";
import { createRoot, Root } from "react-dom/client";

// @ts-expect-error ts doesn't recognize module
import {mockAnimationsApi } from "jsdom-testing-mocks";

mockAnimationsApi();

export let root : Root, container: HTMLDivElement;
beforeEach(() => {
    // Mock window.watchmedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
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

    act(() => root = createRoot(container));
});

afterEach(() => {
    container.remove();
});