import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Clircel Control Plane",
  description: "Minimal UI for job submission and pipeline tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
