import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "totally-not-vercel",
  description:
    "A cinematic control-room landing page for spinning up append lists and inviting contributors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[radial-gradient(circle_at_10%_18%,rgba(255,108,40,0.22),transparent_24%),radial-gradient(circle_at_82%_86%,rgba(255,145,43,0.1),transparent_30%),linear-gradient(180deg,#080808_0%,#030303_45%,#010101_100%)] font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
