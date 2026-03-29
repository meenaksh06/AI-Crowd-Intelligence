"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { 
  Cpu, 
  Database, 
  Globe, 
  Layers, 
  LineChart, 
  Search, 
  ShieldCheck, 
  Zap,
  Github,
  TrendingUp
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 pb-24">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          CrowdIntel AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Transforming passive WiFi signals into actionable campus crowd intelligence using state-of-the-art ML.
        </p>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TechCard 
          icon={<Globe className="h-6 w-6 text-blue-400" />} 
          title="Frontend" 
          tech="Next.js 14, Tailwind, Recharts" 
        />
        <TechCard 
          icon={<Cpu className="h-6 w-6 text-emerald-400" />} 
          title="Backend" 
          tech="FastAPI, Pydantic, Uvicorn" 
        />
        <TechCard 
          icon={<Database className="h-6 w-6 text-purple-400" />} 
          title="Data Layer" 
          tech="SQLite, WAL Mode, Repository Pattern" 
        />
        <TechCard 
          icon={<Zap className="h-6 w-6 text-yellow-400" />} 
          title="AI Engine" 
          tech="Scikit-Learn, Isolation Forest, Polynomial Regression" 
        />
      </div>

      {/* Deep Dive Sections */}
      <div className="space-y-16 mt-16 text-gray-300">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Passive Sensing Architecture</h2>
            <p className="leading-relaxed">
              Unlike camera-based systems that raise privacy concerns and require high bandwidth, 
              <span className="text-white font-medium"> CrowdIntel</span> analyzes anonymous 802.11 management frames. 
              By capturing WiFi probe requests sent by mobile devices, we can estimate occupancy without ever connecting to a device.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mt-1" />
                <span><strong className="text-white">Privacy First:</strong> SHA-256 hashing of MAC addresses ensures user anonymity.</span>
              </li>
              <li className="flex items-start gap-3">
                <Layers className="h-5 w-5 text-primary mt-1" />
                <span><strong className="text-white">RSSI Filtering:</strong> Signal strength analysis helps distinguish between people inside a zone vs. those passing by.</span>
              </li>
            </ul>
          </div>
          <div className="glass-card rounded-3xl p-8 border-primary/20 bg-primary/5">
            <pre className="text-[10px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
{`# Data Ingestion Schema
{
  "ap_id": "AP-LIB-01",
  "zone": "Library Floor 1",
  "probe_requests": [
    { "mac_hash": "a8f9c...", "rssi": -62 },
    { "mac_hash": "b2e1d...", "rssi": -45 }
  ],
  "timestamp": 1711728400
}`}
            </pre>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="glass-card rounded-3xl p-8 order-2 lg:order-1 border-emerald-500/20 bg-emerald-500/5">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
                  <span>FORECASTING_ACCURACY</span>
                  <span>94.2%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[94.2%]" />
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  Trained on 10,000+ simulated probe events with cubic polynomial fitting.
                </p>
             </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-white">The AI Edge</h2>
            <p className="leading-relaxed">
              CrowdIntel doesn't just show you what is happening—it tells you what <span className="text-white font-medium italic">will</span> happen. 
              Our predictive engine uses time-series analysis to find patterns in campus life.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-400 mt-1" />
                <span><strong className="text-white">Predictive Forecasting:</strong> Anticipate lunch-hour rushes and library peaks hours in advance.</span>
              </li>
              <li className="flex items-start gap-3">
                <Search className="h-5 w-5 text-yellow-400 mt-1" />
                <span><strong className="text-white">Anomaly Detection:</strong> Use Isolation Forests to detect unusual clusters or unexpected gatherings.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="text-center pt-12">
        <p className="text-sm text-gray-500 mb-6 italic">Developed as a Production-Grade AI/ML Portfolio Project.</p>
        <a 
          href="https://github.com/meenaksh06" 
          target="_blank" 
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium"
        >
          <Github className="h-5 w-5" />
          View Source Code
        </a>
      </div>
    </div>
  );
}

function TechCard({ icon, title, tech }: { icon: any, title: string, tech: string }) {
  return (
    <Card className="hover:border-primary/30 transition-all group">
      <CardContent className="space-y-4">
        <div className="p-3 rounded-2xl bg-white/5 w-fit group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-gray-400 font-medium">{tech}</p>
        </div>
      </CardContent>
    </Card>
  );
}
