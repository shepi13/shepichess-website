export const toastError = jest.fn();
export const mockToast = jest.fn();

//@ts-expect-error adding property to mock
mockToast.error = toastError;

jest.mock("sonner", () => ({
  ...jest.requireActual("sonner"),
  toast: mockToast,
}));
