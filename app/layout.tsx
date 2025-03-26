import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { StoreProvider } from "./store/storeProvider";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Discover and share your favorite recipes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-manrope">
        <StoreProvider>
          <NavBar />
          {children}
          <Footer />
          <Analytics />
        </StoreProvider>
      </body>
    </html>
  );
}
