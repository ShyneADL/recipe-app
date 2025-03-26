import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { StoreProvider } from "@/app/store/storeProvider";

import { Footer, NavBar } from "@/app/components";

export const metadata = {
  title: "KetoHub",
  description:
    "Discover delicious keto recipes from around the world. Easily search, save, and share your favorite meals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <NavBar />
        <main className="pt-[72px]">
          <StoreProvider>{children}</StoreProvider>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
