"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`glass-card rounded-3xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: ReactNode, variant?: "default" | "warning" | "error" | "success" }) {
  const variants = {
    default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${variants[variant]}`}>
      {children}
    </span>
  );
}
