import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  title: "fixIT | Personal Test Platform",
  description: "Evaluate your skills directly with structured, AI-generated JSON tests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="font-sans h-full antialiased selection:bg-brand-blue selection:text-white">
        {children}
      </body>
    </html>
  );
}