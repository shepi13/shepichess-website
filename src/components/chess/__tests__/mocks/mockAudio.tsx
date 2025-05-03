export const audioState: jest.Mock & { play?: jest.Mock; paused?: jest.Mock } =
  jest.fn();
audioState.play = jest.fn();
audioState.paused = jest.fn(() => true);

const mockUseAudio = jest.fn(() => {
  return audioState;
});

jest.mock("@/lib/hooks/useAudio", () => {
  return {
    __esModule: true,
    useAudio: mockUseAudio,
  };
});
