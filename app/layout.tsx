import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { HydrationProvider } from "@/providers/HydrationProvider";
import { MathProvider } from "@/providers/MathProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Question Type Builder",
    template: "%s · Question Type Builder",
  },
  description: "Math Fill-in-the-Blank (Cloze Text) authoring tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10">
          <HydrationProvider>
            <MathProvider>{children}</MathProvider>
          </HydrationProvider>
        </main>
      </body>
    </html>
  );
}
