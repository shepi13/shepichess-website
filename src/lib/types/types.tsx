// General Types

/** Type for nextJS useSearchParams() */
export type NextSearchParams = {
  [key: string]: string | string[] | undefined;
};

/** Type for PGN Button */
export type PGNButtonSettings = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const moveSoundPath = "/sounds/move.ogg";
export const stockfishPath = "/stockfish/src/stockfish-nnue-16-single.js";
