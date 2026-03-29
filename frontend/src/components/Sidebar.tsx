"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Info, 
  Settings,
  Wifi,
  ShieldAlert
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Predictions", href: "/predictions", icon: TrendingUp },
  { name: "Project Info", href: "/about", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/5 bg-[#090e1a]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-white/5 px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <span className="tracking-tight text-xl">Crowd<span className="text-primary">Intel</span></span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
              )} />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent p-4 border border-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-white">AI Engine Active</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Real-time inference running on RandomForest model.
          </p>
        </div>
      </div>

      <div className="mt-auto border-t border-white/5 p-4">
        <button className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white">
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
