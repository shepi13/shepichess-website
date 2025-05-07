"use client";

import { Attribute, ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";

/**
 * Properties that can be passed to theme provicder
 */
export type ThemeProps = {
  attribute: Attribute;
  defaultTheme: string;
  enableSystem: boolean;
};

/** Theme provider to manage light/dark mode */
export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<ThemeProps>) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
