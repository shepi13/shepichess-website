"use client";

import { Attribute, ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";

type ThemeProps = {
    attribute: Attribute;
    defaultTheme: string;
    enableSystem: boolean;
};

export default function ThemeProvider({
    children,
    ...props
}: React.PropsWithChildren<ThemeProps>) {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
