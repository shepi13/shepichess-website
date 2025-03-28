import type { Metadata } from "next";
import "@/css/globals.css";
import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import SVGGrainyFilter from "@/components/BackgroundFilter";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: {
    default: "Chess Coaching | Flowood MS",
    template: "%s | shepichess | NM Duncan Shepherd"
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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SVGGrainyFilter />
          <div className="content">
            <header>
              <NavBar />
            </header>
            <main>{children}</main>
            <footer>
              <Footer />
            </footer>
          </div>
      </ThemeProvider>
      </body>
    </html>
  );
}
