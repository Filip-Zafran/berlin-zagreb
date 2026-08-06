import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Via — Berlin & Zagreb rides",
  description: "Find and share rides between Berlin and Zagreb.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
