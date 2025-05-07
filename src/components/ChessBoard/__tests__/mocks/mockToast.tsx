export const toastError = jest.fn();

jest.mock("sonner", () => ({
  ...jest.requireActual("sonner"),
  toast: { error: toastError },
}));
