// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"; // ✅ Added import

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO Metadata
export const metadata = {
  title: {
    default: "Inkforge — Modern Blogging Platform",
    template: "%s | Inkforge",
  },
  description:
    "A fast, modern platform to create, publish, and explore blogs effortlessly.",
  keywords: [
    "blog",
    "blog platform",
    "write online",
    "blog creation",
    "articles",
    "content publishing",
  ],
  openGraph: {
    title: "Inkforge — Modern Blogging Platform",
    description:
      "Create and publish blogs with a clean, beautiful modern experience.",
    type: "website",
    locale: "en_US",
    siteName: "Inkforge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkforge",
    description: "Create, publish, and explore blogs easily.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
      >
        <main className="min-h-screen flex flex-col">
          {children}
        </main>

        <Analytics /> 
      </body>
    </html>
  );
}
