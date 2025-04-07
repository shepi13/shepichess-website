import type { Metadata } from "next";
import "@/css/globals.css";
import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/theme/ThemeProvider";
import SVGGrainyFilter from "@/components/BackgroundFilter";
import Footer from "@/components/Footer";

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
          <div className="content flex flex-col min-h-screen justify-between">
            <div>
              <NavBar />
              <main className="px-5">{children}</main>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
