"use client"

import { useEffect, useState } from "react"
import { useBusStore } from "@/store/busStore"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export default function OperationalCharts() {
  const { buses, routes } = useBusStore()
  const [mounted, setMounted] = useState(false)

  // Prevent Next.js hydration SSR issues with Recharts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full glass-panel rounded-2xl flex items-center justify-center border border-white/5 p-4">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">Syncing Fleet Telemetry...</span>
      </div>
    )
  }

  // Prepping Chart Data 1: Bus Fuel/Battery Levels
  const fuelData = buses.map((bus) => ({
    name: bus.busId,
    battery: Math.round(bus.fuelLevel),
    passengers: bus.passengers,
  }))

  // Prepping Chart Data 2: Peak load compares across routes
  const routeLoadData = routes.map((r) => {
    const routeBuses = buses.filter((b) => b.routeId === r.id)
    const currentPassengers = routeBuses.reduce((acc, curr) => acc + curr.passengers, 0)
    const totalCapacity = routeBuses.reduce((acc, curr) => acc + curr.capacity, 0)

    return {
      name: r.name.split(" ")[0],
      passengers: currentPassengers,
      capacity: totalCapacity,
    }
  })

  // Calculating overall operational metrics
  const avgSpeed = Math.round(buses.reduce((acc, curr) => acc + curr.speed, 0) / buses.length)
  const totalCommuters = buses.reduce((acc, curr) => acc + curr.passengers, 0)
  const delayedFleetCount = buses.filter((b) => b.status !== "on-time").length

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden select-none">
      
      {/* KPI 1: Telemetry KPI Widgets */}
      <div className="flex flex-col justify-between p-2 border-r border-white/5 gap-2 shrink-0 md:col-span-1">
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">System Telematics</h3>
          <h2 className="text-xs font-extrabold text-cyan-400 mt-0.5">FLEET PERFORMANCE INDEX</h2>
        </div>

        <div className="space-y-3 my-2">
          {/* Average speed */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">Avg Fleet Velocity</span>
            <span className="text-slate-200 font-mono font-bold">{avgSpeed} km/h</span>
          </div>
          {/* Total passengers */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">Active Commuters</span>
            <span className="text-cyan-400 font-mono font-bold">{totalCommuters} pax</span>
          </div>
          {/* Warnings */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">Delay Incidents</span>
            <span className={`font-mono font-bold ${delayedFleetCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
              {delayedFleetCount} active
            </span>
          </div>
        </div>

        <div className="text-[9px] font-bold text-slate-500 tracking-wider">
          Telemetry synced: 1.5s interval
        </div>
      </div>

      {/* CHART 2: Fuel/Battery Drain Stream */}
      <div className="flex flex-col col-span-1 md:col-span-2 min-w-0 h-full p-1 gap-1">
        <div className="flex justify-between items-center shrink-0 px-1">
          <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">TELEMETRY STREAM</h4>
          <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wide bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Live Battery %
          </span>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fuelData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={9} 
                fontFamily="Outfit"
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={9} 
                fontFamily="Outfit"
                domain={[0, 100]}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(10,10,25,0.9)",
                  borderColor: "rgba(16,185,129,0.2)",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "Outfit"
                }}
              />
              <Area
                type="monotone"
                dataKey="battery"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#batteryGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 3: Peak loads compare */}
      <div className="flex flex-col col-span-1 min-w-0 h-full p-1 gap-1">
        <div className="flex justify-between items-center shrink-0 px-1">
          <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">PASSENGER LOAD DENSITY</h4>
          <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-wide bg-cyan-500/10 px-1.5 py-0.5 rounded">
            Route Cap
          </span>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeLoadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={9} 
                fontFamily="Outfit"
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={9} 
                fontFamily="Outfit"
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(10,10,25,0.9)",
                  borderColor: "rgba(0,240,255,0.2)",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "Outfit"
                }}
              />
              <Bar dataKey="passengers" fill="#00f0ff" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="capacity" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
