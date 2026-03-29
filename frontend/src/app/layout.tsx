import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrowdIntel | AI-Powered Campus Crowd Intelligence",
  description: "Advanced real-time crowd density monitoring and predictive analytics for smart campus management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#030712] text-gray-100 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-[#030712] via-[#090e1a] to-[#030712]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
