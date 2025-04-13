import type { Metadata } from "next";

import { EngineProvider } from "@/components/EngineProvider";
import { SVGGrainyFilter } from "@/components/mainLayout/BackgroundFilter";
import { Footer } from "@/components/mainLayout/Footer";
import { Header } from "@/components/mainLayout/Header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

import "@/css/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Chess Coaching | Flowood MS",
    template: "%s | shepichess | NM Duncan Shepherd",
  },
  description: "Chess Center and Coaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SVGGrainyFilter />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <EngineProvider>
            <div className="content flex flex-col min-h-screen justify-between">
              <div>
                <Header />
                <main className="px-5">{children}</main>
              </div>
              <Footer />
            </div>
          </EngineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
