import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Providers } from "./providers";

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
    <html lang="en">
      <head>
        {/* Preload the custom font for faster LCP */}
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
          <NavBar />
          {children}
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
