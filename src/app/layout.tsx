import type { Metadata } from "next";

import { Toaster } from "sonner";

import { EngineProvider } from "@/components/EngineProvider";
import { SVGGrainyFilter } from "@/components/Layout/BackgroundFilter";
import { Footer } from "@/components/Layout/Footer";
import { Header } from "@/components/Layout/Header";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";

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
        <Toaster position="bottom-center" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <EngineProvider>
            <div className="content flex flex-col min-h-screen justify-between items-center">
              <div className="py-5 w-5/6 md:w-4/5 xl:w-2/3 flex flex-col gap-20 items-center">
                <Header />
                <main>{children}</main>
              </div>
              <Footer />
            </div>
          </EngineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
