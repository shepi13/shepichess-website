import { ImageProps } from "next/image";

import { SVGProps } from "react";

export const lightColors = {
  primary: "fill-primary",
  secondary: "fill-secondary",
  black: "fill-primaryblack",
  white: "fill-white",
  gold: "fill-[#dfc387]",
  lightBrown: "fill-[#f0d9b5]",
  darkBrown: "fill-[#b58b63]",
  maroon: "fill-[#8a0c3a]",
  slate100: "fill-slate-100",
  slate200: "fill-slate-200",
  slate300: "fill-slate-300",
  slate400: "fill-slate-400",
  slate500: "fill-slate-500",
  slate600: "fill-slate-600",
  slate700: "fill-slate-700",
  slate800: "fill-slate-800",
  slate900: "fill-slate-900",
};

export const darkColors = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  black: "bg-primaryblack",
  white: "bg-white",
  gold: "bg-[#dfc387]",
  lightBrown: "bg-[#f0d9b5]",
  darkBrown: "bg-[#b58b63]",
  maroon: "bg-[#8a0c3a]",
  slate100: "bg-slate-100",
  slate200: "bg-slate-200",
  slate300: "bg-slate-300",
  slate400: "bg-slate-400",
  slate500: "bg-slate-500",
  slate600: "bg-slate-600",
  slate700: "bg-slate-700",
  slate800: "bg-slate-800",
  slate900: "bg-slate-900",
};

export const hoverColors = {
  primary: "hover:fill-primary",
  secondary: "hover:fill-secondary",
  black: "hover:fill-primaryblack",
  white: "hover:fill-white",
  gold: "hover:fill-[#dfc387]",
  lightBrown: "hover:fill-[#f0d9b5]",
  darkBrown: "hover:fill-[#b58b63]",
  maroon: "hover:fill-[#8a0c3a]",
  slate100: "hover:fill-slate-100",
  slate200: "hover:fill-slate-200",
  slate300: "hover:fill-slate-300",
  slate400: "hover:fill-slate-400",
  slate500: "hover:fill-slate-500",
  slate600: "hover:fill-slate-600",
  slate700: "hover:fill-slate-700",
  slate800: "hover:fill-slate-800",
  slate900: "hover:fill-slate-900",
  none: "",
};

export const strokeColors = {
  none: "stroke-none",
  black: "stroke-black",
};

export type ChessBoardIconSquareCount = 2 | 3 | 4 | 6 | 8;

export type ChessBoardIconProps = {
  lightColor?: keyof typeof lightColors;
  darkColor?: keyof typeof darkColors;
  numSquares: ChessBoardIconSquareCount;
  alt?: string;
  className?: string;
  strokeColor?: keyof typeof strokeColors;
  hoverColor?: keyof typeof hoverColors;
} & Omit<ImageProps, "src" | "alt" | "fill">;

export function ChessBoardIcon({
  numSquares,
  lightColor = "white",
  darkColor = "black",
  alt = "Checkerboard Icon",
  className = "",
  strokeColor = "none",
  hoverColor = "none",
  ...imageProps
}: ChessBoardIconProps) {
  // Return correct component with props
  const props = {
    ...imageProps,
    className: [
      lightColors[lightColor],
      darkColors[darkColor],
      strokeColors[strokeColor],
      hoverColors[hoverColor],
    ].join(" "),
  } as SVGProps<SVGSVGElement>;
  const { viewBox, path } = getChessBoardSVGData(numSquares);

  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        fill="currentColor"
        viewBox={viewBox}
        role="img"
        {...props}
      >
        {path}
        <desc>{alt}</desc>
      </svg>
    </div>
  );
}

// Returns SVG Path for a chess icon with the specified number of rows/columns
function getChessBoardSVGData(numSquares: ChessBoardIconSquareCount) {
  switch (numSquares) {
    case 2:
      return {
        viewBox: "0 0 92.7435 92.74355",
        path: (
          <path d="M0 0h46.372v46.372H0zM46.372 46.372h46.371v46.371H46.372Z" />
        ),
      };
    case 3:
      return {
        viewBox: "0 0 139.115 139.115",
        path: (
          <path d="M0 0h46.372v46.372H0zM46.372 46.372h46.371v46.371H46.372ZM0 92.743h46.372v46.372H0zM92.743 0h46.372v46.372H92.743ZM92.743 92.743h46.372v46.372H92.743Z" />
        ),
      };
    case 4:
      return {
        viewBox: "0 0 185.487 185.487",
        path: (
          <path d="M0 0h46.372v46.372H0zM46.372 46.372h46.371v46.371H46.372ZM0 92.743h46.372v46.372H0zM46.372 139.115h46.371v46.372H46.372ZM92.743 0h46.372v46.372H92.743ZM139.115 46.372h46.372v46.371h-46.372ZM92.743 92.743h46.372v46.372H92.743ZM139.115 139.115h46.372v46.372h-46.372z" />
        ),
      };
    case 6:
      return {
        viewBox: "0 0 137.14 137.14",
        path: (
          <>
            <path d="M.065.065h22.846v22.846H.065Z" />
            <path d="M22.91 22.91h22.847v22.847H22.91Z" />
            <path d="M.065 45.757h22.846v22.845H.065ZM22.91 68.602h22.847v22.846H22.91ZM45.757.065h22.845v22.846H45.757ZM68.602 22.91h22.846v22.847H68.602ZM45.757 45.757h22.845v22.845H45.757ZM68.602 68.602h22.846v22.846H68.602Z" />
            <path d="M.065 91.448h22.846v22.846H.065ZM22.91 114.294h22.847v22.846H22.91ZM45.757 91.448h22.845v22.846H45.757ZM68.602 114.294h22.846v22.846H68.602ZM91.448.065h22.846v22.846H91.448Z" />
            <path d="M114.294 22.91h22.846v22.847h-22.846z" />
            <path d="M91.448 45.757h22.846v22.845H91.448ZM114.294 68.602h22.846v22.846h-22.846z" />
            <path d="M91.448 91.448h22.846v22.846H91.448ZM114.294 114.294h22.846v22.846h-22.846z" />
          </>
        ),
      };
    case 8:
      return {
        viewBox: "0 0 182.831 182.831",
        path: (
          <>
            <path d="M.065.065h22.846v22.846H.065Z" />
            <path d="M22.91 22.91h22.847v22.847H22.91Z" />
            <path d="M.065 45.757h22.846v22.845H.065ZM22.91 68.602h22.847v22.846H22.91ZM45.757.065h22.845v22.846H45.757ZM68.602 22.91h22.846v22.847H68.602ZM45.757 45.757h22.845v22.845H45.757ZM68.602 68.602h22.846v22.846H68.602Z" />
            <path d="M.065 91.448h22.846v22.846H.065ZM22.91 114.294h22.847v22.846H22.91ZM.065 137.14h22.846v22.845H.065ZM22.91 159.985h22.847v22.846H22.91ZM45.757 91.448h22.845v22.846H45.757ZM68.602 114.294h22.846v22.846H68.602ZM45.757 137.14h22.845v22.845H45.757ZM68.602 159.985h22.846v22.846H68.602ZM91.448.065h22.846v22.846H91.448Z" />
            <path d="M114.294 22.91h22.846v22.847h-22.846z" />
            <path d="M91.448 45.757h22.846v22.845H91.448ZM114.294 68.602h22.846v22.846h-22.846zM137.14.065h22.845v22.846H137.14zM159.985 22.91h22.846v22.847h-22.846ZM137.14 45.757h22.845v22.845H137.14zM159.985 68.602h22.846v22.846h-22.846Z" />
            <path d="M91.448 91.448h22.846v22.846H91.448ZM114.294 114.294h22.846v22.846h-22.846zM91.448 137.14h22.846v22.845H91.448ZM114.294 159.985h22.846v22.846h-22.846zM137.14 91.448h22.845v22.846H137.14zM159.985 114.294h22.846v22.846h-22.846ZM137.14 137.14h22.845v22.845H137.14zM159.985 159.985h22.846v22.846h-22.846z" />
          </>
        ),
      };
  }
}
