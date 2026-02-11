import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://newage-longevity.vercel.app"),
  title: "Time Analyzer | New Age Longevity",
  description:
    "Discover your personalized longevity protocol based on the time you actually have. Free, science-backed recommendations in 2 minutes.",
  openGraph: {
    title: "Time Analyzer | New Age Longevity",
    description:
      "Discover your personalized longevity protocol based on the time you actually have.",
    type: "website",
    siteName: "New Age Longevity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Analyzer | New Age Longevity",
    description:
      "Discover your personalized longevity protocol based on the time you actually have.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
