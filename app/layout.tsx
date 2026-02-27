import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doraty – Smart Educational Platform",
  description:
    "Doraty is a cross-platform educational platform providing automated exams, course management, question banks, and structured digital learning tools for students and teachers.",
  keywords: [
    "educational platform",
    "online exams",
    "course management",
    "e-learning",
    "question banks",
    "digital learning",
    "students",
    "teachers",
    "Doraty",
  ],
  authors: [{ name: "Doraty Team" }],
  creator: "Doraty",
  publisher: "Doraty",
  metadataBase: new URL("https://doraty.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doraty.app",
    title: "Doraty – Smart Educational Platform",
    description:
      "Automated exams, course management, and structured digital learning for students and teachers. Available on Web, Android, and Windows.",
    siteName: "Doraty",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Doraty – Smart Educational Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doraty – Smart Educational Platform",
    description:
      "Automated exams, course management, and structured digital learning for students and teachers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
