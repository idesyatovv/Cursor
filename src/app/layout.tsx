import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baseline Checkout",
  description: "A small checkout baseline"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
