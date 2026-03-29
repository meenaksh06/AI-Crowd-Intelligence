"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, X, Wifi } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#030712] text-gray-100 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Mobile Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-[#090e1a]/50 px-4 backdrop-blur-lg lg:hidden">
              <div className="flex items-center gap-2 font-bold text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
                  <Wifi className="h-5 w-5 text-white" />
                </div>
                <span className="tracking-tight text-lg">Crowd<span className="text-primary">Intel</span></span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Toggle Menu"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </header>

            <main className="flex-1 overflow-auto bg-gradient-to-br from-[#030712] via-[#090e1a] to-[#030712]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
