"use client"

import { useEffect } from "react"
import { useBusStore } from "@/store/busStore"
import { startSimulation, stopSimulation } from "@/lib/simulator/gpsEngine"
import FleetOverview from "@/components/buses/FleetOverview"
import IntelligencePanel from "@/components/hud/IntelligencePanel"
import OperationalCharts from "@/components/charts/OperationalCharts"
import NotificationEngine from "@/components/ui/NotificationEngine"
import dynamic from "next/dynamic"

// Import LiveMap dynamically with SSR disabled to prevent Leaflet window errors during Next.js compilation
const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#070712] border border-white/5 rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-cyan-400/70 font-medium tracking-wide">Initializing Telematics Engine...</p>
      </div>
    </div>
  ),
})

export default function Dashboard() {
  const { isSimulating, simSpeed, toggleSimulation, setSimSpeed, notifications } = useBusStore()

  // Start simulation loop on mount
  useEffect(() => {
    startSimulation()
    return () => {
      stopSimulation()
    }
  }, [])

  return (
    <main className="relative flex flex-col min-h-screen bg-[#030308] text-slate-100 p-4 gap-4 overflow-x-hidden md:p-6 lg:h-screen lg:overflow-hidden select-none">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* TOP HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-2xl glass-panel-glow gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-neon-cyan">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              VANTAGE TRANSIT INTELLIGENCE
            </h1>
            <p className="text-xs text-slate-400/80 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-emerald-400/90 font-semibold uppercase tracking-wider text-[10px]">Fleet Online</span>
              <span className="text-slate-600">•</span>
              <span>100% Operational (AWS Cluster-12)</span>
            </p>
          </div>
        </div>

        {/* Dispatch Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900/60 border border-white/5 rounded-xl p-1">
            <button
              onClick={toggleSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
                isSimulating
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 shadow-neon-cyan"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {isSimulating ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>LIVE TRANSMITTING</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>SIMULATION PAUSED</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 px-2 border-l border-white/5 ml-1">
              {([1, 2, 5] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed)}
                  className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide transition-all ${
                    simSpeed === speed
                      ? "bg-white/10 text-cyan-400 border border-white/5"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col text-right pr-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">System Clock</span>
            <span className="text-xs font-mono font-bold text-cyan-400/90 tracking-wider">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 overflow-hidden min-h-0">
        
        {/* SIDEBAR LEFT */}
        <section className="w-full lg:w-[320px] flex flex-col gap-4 min-h-0">
          <FleetOverview />
        </section>

        {/* CENTER REGION (MAP & CHARTS) */}
        <section className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Geographic Map container */}
          <div className="flex-1 rounded-2xl overflow-hidden glass-panel relative border border-white/5 min-h-[400px]">
            <LiveMap />
          </div>

          {/* Bottom telemetry analytics dock */}
          <div className="h-[220px] lg:h-[240px] shrink-0">
            <OperationalCharts />
          </div>
        </section>

        {/* SIDEBAR RIGHT */}
        <section className="w-full lg:w-[340px] flex flex-col gap-4 min-h-0">
          <IntelligencePanel />
        </section>
      </div>

      {/* Real-time Notification engine toast overlay */}
      <NotificationEngine />
    </main>
  )
}
