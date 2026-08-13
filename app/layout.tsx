import { Inter, Noto_Sans_Thai } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
});

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488",
};

export const metadata: Metadata = {
  title: "Agnos Health — Patient Form & Real-Time Staff Portal",
  description:
    "Real-time synchronized patient intake form and hospital staff monitoring system by Agnos.",
  keywords: ["Agnos", "Healthcare", "Patient Form", "Realtime", "Staff View", "Next.js"],
  authors: [{ name: "Nanthapat" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
        {children}
        <Toaster
          richColors
          position="top-right"
          closeButton
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "var(--font-thai), var(--font-inter), sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
