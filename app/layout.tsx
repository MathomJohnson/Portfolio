import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { ClientMotionProvider } from "@/components/providers/ClientMotionProvider";
import "./globals.css";

/**
 * Fonts are self-hosted and preloaded. `display: "block"` is used instead of
 * "swap" so text never renders in a fallback face and then reflow into the real
 * one — combined with preloading, the block period is imperceptible.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "block",
  preload: true,
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "block",
  preload: true,
});

const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  style: "normal",
  display: "block",
  preload: true,
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  // [DRAFT] Confirm metadata copy before ship.
  title: "Mathom Johnson — Software Engineer",
  description:
    "Software engineer studying CS and Data Science at UW–Madison. Co-founder and founding engineer at Praxora Education.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Mathom Johnson — Software Engineer",
    description:
      "Software engineer studying CS and Data Science at UW–Madison. Co-founder and founding engineer at Praxora Education.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${generalSans.variable} antialiased`}
      >
        <ClientMotionProvider>{children}</ClientMotionProvider>
      </body>
    </html>
  );
}
