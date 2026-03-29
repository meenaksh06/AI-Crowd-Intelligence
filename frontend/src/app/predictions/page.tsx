"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { BrainCircuit, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

import { API_BASE } from "@/config";

export default function PredictionsPage() {
  const [forecast, setForecast] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const [fRes, aRes] = await Promise.all([
          axios.get(`${API_BASE}/forecast`),
          axios.get(`${API_BASE}/anomalies`)
        ]);
        setForecast(fRes.data);
        setAnomalies(aRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  if (loading) return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-12 w-1/3 bg-white/5 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-white/5 rounded-3xl" />
        <div className="h-[400px] bg-white/5 rounded-3xl" />
      </div>
    </div>
  );

  const forecastData = forecast?.forecast.map((p: any) => ({
    time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    people: Math.round(p.predicted_people)
  }));

  const anomalyData = anomalies?.anomalies.map((a: any, i: number) => ({
    id: i,
    val: a.people_count,
    score: Math.abs(a.score) * 100,
    isAnomaly: a.is_anomaly
  }));

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">Predictive AI Engine</h1>
          <p className="text-gray-400 text-xs md:text-sm">Advanced time-series forecasting and anomaly detection.</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary">Model: RandomForest + PolyRegression</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Chart */}
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Crowd Forecast (Next 6 Hours)
              </h2>
              <Badge variant="default">Confidence: 94%</Badge>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
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
                    dataKey="people" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorForecast)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Explanation / Insights */}
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                AI Strategy
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                The forecasting engine uses <span className="text-white font-medium">Polynomial Regression</span> to identify temporal cycles in campus movement. 
                By correlating historical probe peaks, it anticipates future congestion before it happens.
              </p>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Regression Degree</span>
                  <span className="text-white font-mono">3 (Cubic)</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Smoothing Window</span>
                  <span className="text-white font-mono">15 mins</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/10">
            <CardContent className="space-y-4">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Recent Anomalies
              </h3>
              <div className="space-y-3">
                {anomalies?.anomalies.filter((a:any) => a.is_anomaly).slice(0, 3).map((a:any, i:number) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-red-500/10 border border-red-500/10">
                    <span className="text-[10px] font-bold text-red-300">UNEXPECTED PEAK</span>
                    <span className="text-xs text-white font-medium">{a.zone} detected {Math.round(a.people_count)} people</span>
                    <span className="text-[10px] text-red-400/70 font-mono italic">{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
                {anomalies?.anomalies.filter((a:any) => a.is_anomaly).length === 0 && (
                  <p className="text-xs text-gray-500 italic">No unusual activities detected by Isolation Forest.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Anomaly Scatter Plot */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold text-white mb-2">Isolation Forest: Feature Mapping</h2>
          <p className="text-sm text-gray-500 mb-8">Visualizing the model's decision boundary for anomaly score (X) vs People Count (Y).</p>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#ffffff05" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="score" name="Anomaly Score" stroke="#9ca3af" fontSize={10} hide />
                <YAxis type="number" dataKey="val" name="People" stroke="#9ca3af" fontSize={10} />
                <ZAxis type="number" dataKey="score" range={[100, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    borderColor: '#ffffff10',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Scatter name="Zones" data={anomalyData} shape="circle">
                  {anomalyData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.isAnomaly ? '#ef4444' : '#3b82f6'} fillOpacity={0.6} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
