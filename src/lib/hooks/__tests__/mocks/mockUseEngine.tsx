/* eslint-disable @typescript-eslint/ban-ts-comment */
import { jest } from "@jest/globals";

export const postMessageSpyMock = jest.fn();
export const constructorSpyMock = jest.fn();
export const terminateSpyMock = jest.fn();

const mockWorker = class {
    postMessage: jest.Mock<(data: string) => void>;
    terminate: jest.Mock;
    onmessage: ((arg0: MessageEvent) => void) | null;
    evaluated: boolean;

    constructor(file: string) {
        constructorSpyMock(file);
        this.evaluated = false;
        this.postMessage = jest.fn((data: string) => {
            let response = "";
            if (data == "uci") {
                response = "uci";
            } else if (data == "isready") {
                response = "readyok";
            }
            // Send first message with depth, second without
            else if (data.startsWith("go depth") && !this.evaluated) {
                response =
                    "bestmove  e2e4  ponder e7e5  cp 40  depth 12 pv e2e4 e7e5";
                this.evaluated = true;
            } else if (data.startsWith("go depth")) {
                response = "bestmove  e2e4  ponder e7e5  cp 40  pv e2e4 e7e5";
            }
            if (this.onmessage != null) {
                // @ts-expect-error
                this.onmessage({ data: response });
            }
            postMessageSpyMock(data);
        });
        this.terminate = jest.fn(() => {
            terminateSpyMock();
        });
        this.onmessage = null;
    }
};

// @ts-expect-error
global.Worker = mockWorker;
