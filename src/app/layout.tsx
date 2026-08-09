import type { Metadata } from "next";
import socialLogo from "@/images/zagreb berlin logo with text.png";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://berlin-zagreb.vercel.app"),
  title: "Berlin Zagreb Transport",
  description: "Find and share rides between Berlin and Zagreb.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Berlin Zagreb Transport",
    title: "Berlin Zagreb Transport",
    description: "Find and share rides between Berlin and Zagreb.",
    images: [
      {
        url: socialLogo.src,
        width: socialLogo.width,
        height: socialLogo.height,
        alt: "Berlin Zagreb Transport logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berlin Zagreb Transport",
    description: "Find and share rides between Berlin and Zagreb.",
    images: [socialLogo.src],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
