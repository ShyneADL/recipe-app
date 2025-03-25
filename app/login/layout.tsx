export const metadata = {
  title: "KetoHub",
  description:
    "Join us at KetoHub and discover new recipes to kickstart your ketogenic diet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">{children}</body>
    </html>
  );
}
