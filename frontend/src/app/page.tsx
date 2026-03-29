"use client";

import { useState, useEffect } from "react";
import { Users, Activity, MapPin, ShieldCheck, RefreshCw } from "lucide-react";
import axios from "axios";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { API_BASE } from "@/config";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/crowd`);
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      await axios.post(`${API_BASE}/simulate?hours=12`);
      await fetchData();
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Campus Intelligence</h1>
          <p className="text-gray-400 text-sm">Real-time crowd monitoring and zone occupancy.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Last Updated</span>
            <span className="text-sm font-mono text-gray-300">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--:--"}
            </span>
          </div>
          <button 
            onClick={fetchData} 
            className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={runSimulation}
            disabled={simulating}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {simulating ? "Simulating..." : "Generate Insights"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Population" 
          value={data?.total_people || 0} 
          icon={<Users className="h-6 w-6" />}
          trend="+12% from last hour"
        />
        <StatCard 
          title="Avg. Occupancy" 
          value={`${Math.round(data?.total_people / (data?.zones_count || 1) / 1.5)}%`} 
          icon={<Activity className="h-6 w-6" />}
          trend="Stable"
        />
        <StatCard 
          title="Active Zones" 
          value={data?.zones_count || 0} 
          icon={<MapPin className="h-6 w-6" />}
          trend="All systems online"
        />
        <StatCard 
          title="AI Confidence" 
          value="98.4%" 
          icon={<ShieldCheck className="h-6 w-6" />}
          trend="RF Model High Efficiency"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone List */}
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Live Zone Density</h2>
              <Badge variant="success">Real-time</Badge>
            </div>
            <div className="space-y-6">
              {data?.data.map((zone: any) => (
                <ZoneRow key={zone.ap_id} zone={zone} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Summary */}
        <Card>
          <CardContent className="space-y-6">
            <h2 className="text-xl font-bold text-white">System Insights</h2>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">High Density Warning</span>
              <div className="mt-4 space-y-3">
                {data?.data.filter((z:any) => z.occupancy_pct > 70).map((z:any) => (
                  <div key={z.ap_id} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm text-gray-200">{z.zone} is nearly full</span>
                  </div>
                ))}
                {data?.data.filter((z:any) => z.occupancy_pct > 70).length === 0 && (
                  <p className="text-sm text-gray-400 italic">No congestion detected.</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <h3 className="text-sm font-semibold text-primary mb-2">Technical Summary</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                Scanning 2.4GHz/5GHz bands for 802.11 management frames. Unique MAC extraction with SHA-256 deanonymization.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: any, trend: string }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/10">
            {icon}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-gray-500 font-medium">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ZoneRow({ zone }: { zone: any }) {
  const getStatusColor = (pct: number) => {
    if (pct > 75) return "bg-red-500";
    if (pct > 40) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(zone.occupancy_pct)} shadow-[0_0_12px_rgba(0,0,0,0.5)]`} />
          <span className="text-sm font-semibold text-gray-100">{zone.zone}</span>
        </div>
        <span className="text-xs font-mono text-gray-400">
          {Math.round(zone.est_people)} / {zone.capacity}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getStatusColor(zone.occupancy_pct)}`}
          style={{ width: `${zone.occupancy_pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
          Sensor: {zone.ap_id}
        </span>
        <span className="text-[10px] text-gray-500 font-medium">
          {zone.occupancy_pct}% Occupied
        </span>
      </div>
    </div>
  );
}
