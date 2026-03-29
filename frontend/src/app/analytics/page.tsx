"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, BarChart3, Filter } from "lucide-react";

import { API_BASE } from "@/config";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE}/crowd`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-gray-400 font-mono animate-pulse">Computing historical aggregates...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Historical Analytics</h1>
          <p className="text-gray-400 text-sm">Long-term patterns and zone-wise distribution.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
            <Calendar className="h-4 w-4" />
            Last 24 Hours
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" />
            All Zones
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution Chart */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Zone Distribution
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="zone" 
                    stroke="#9ca3af" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    interval={0}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      borderColor: '#ffffff10',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="est_people" radius={[4, 4, 0, 0]}>
                    {data?.data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.occupancy_pct > 70 ? '#ef4444' : '#3b82f6'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Aggregated Trends */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Temporal Flux
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.data}>
                  <defs>
                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="ap_id" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      borderColor: '#ffffff10',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="est_people" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPop)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 uppercase text-[10px] tracking-widest text-gray-500 font-bold">
                  <th className="pb-4">Access Point</th>
                  <th className="pb-4">Zone Name</th>
                  <th className="pb-4">Device Count</th>
                  <th className="pb-4">Avg RSSI</th>
                  <th className="pb-4">Est. People</th>
                  <th className="pb-4">Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.data.map((zone: any) => (
                  <tr key={zone.ap_id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-sm font-mono text-gray-400">{zone.ap_id}</td>
                    <td className="py-4 text-sm font-semibold text-white">{zone.zone}</td>
                    <td className="py-4 text-sm text-gray-300">{zone.unique_devices}</td>
                    <td className="py-4 text-sm text-gray-400">{zone.mean_rssi} dBm</td>
                    <td className="py-4 text-sm font-bold text-primary">{Math.round(zone.est_people)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${zone.occupancy_pct > 75 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${zone.occupancy_pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{zone.occupancy_pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
