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
