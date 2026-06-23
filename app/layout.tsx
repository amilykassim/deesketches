import type { Metadata } from "next";
import { Caveat, Kalam, Patrick_Hand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Shell } from "./shell";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-hand",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Andiko · tiny sketches, big feelings",
  description: "Andiko · hand-drawn cards & doodles, made one at a time.",
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${kalam.variable} ${patrickHand.variable}`}
    >
      <body>
        <Shell>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
