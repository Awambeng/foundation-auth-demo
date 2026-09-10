import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abdullah Foundation – Auth Demo",
  description: "Authentication demo with Keycloak and Auth.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <SessionProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 py-10">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
