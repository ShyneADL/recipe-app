import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "KetoHub - Discover & Share Keto Recipes",
    template: "%s | KetoHub",
  },
  description:
    "Discover, share and connect with foodies around the world. Explore thousands of keto recipes by category.",
  keywords: ["keto", "recipes", "low-carb", "diet", "food"],
  openGraph: {
    title: "KetoHub - Discover & Share Keto Recipes",
    description:
      "Discover, share and connect with foodies around the world. Explore thousands of keto recipes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning prevents React from complaining about the
    // `dark` class being added by JS on the client when it wasn't there
    // during SSR. This is the standard pattern for class-based dark mode.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Manrope-VariableFont_wght.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-manrope">
        <Providers>
          {/* ThemeProvider must be inside Providers so it can access the Zustand store */}
          <ThemeProvider>
            <NavBar />
            {children}
            <Footer />
            <Analytics />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
