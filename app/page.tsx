"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useBusStore } from "@/store/busStore"
import { startSimulation, stopSimulation } from "@/lib/simulator/gpsEngine"

// Global dashboard layout panels
import RoleConsole from "@/components/dashboard/RoleConsole"
import FleetOverview from "@/components/buses/FleetOverview"
import IntelligencePanel from "@/components/hud/IntelligencePanel"
import OperationalCharts from "@/components/charts/OperationalCharts"
import NotificationEngine from "@/components/ui/NotificationEngine"
import AiChatBot from "@/components/ai/AiChatBot"

// Role panels
import DriverConsole from "@/components/buses/DriverConsole"
import StudentTracker from "@/components/hud/StudentTracker"
import ParentSafetyHub from "@/components/hud/ParentSafetyHub"

// Load Map dynamically to prevent SSR Leaflet window errors
const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3 bg-slate-950/80 rounded-2xl border border-white/5">
      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-cyan-300 tracking-wider">INITIALIZING MAP SYSTEM...</p>
    </div>
  ),
})

export default function Home() {
  const { activeRole, isSimulating, simSpeed, sosTriggered, setSosTriggered } = useBusStore()

  // Manage simulator ticks
  useEffect(() => {
    startSimulation()
    return () => {
      stopSimulation()
    }
  }, [])

  // Restart simulator automatically if speed or toggle settings update
  useEffect(() => {
    stopSimulation()
    if (isSimulating) {
      startSimulation()
    }
  }, [isSimulating, simSpeed])

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-slate-100 overflow-hidden flex flex-col p-4 gap-4 antialiased">
      
      {/* Global CSS Particle Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none z-0"></div>

      {/* Global Role Select Pill Switch Header */}
      <div className="z-10 shrink-0">
        <RoleConsole />
      </div>

      {/* Master Swappable Role Layout Section */}
      <div className="flex-1 min-h-0 z-10">
        
        {activeRole === "admin" ? (
          /* 1. ADMIN DISPATCH COMMAND ROOM */
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
            
            {/* Fleet Overview Panel (1/4 Column) */}
            <div className="lg:col-span-1 h-full min-h-0">
              <FleetOverview />
            </div>

            {/* Map & bottom Recharts area (2/4 Column) */}
            <div className="lg:col-span-2 h-full flex flex-col gap-4 min-h-0">
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative min-h-[300px]">
                <LiveMap />
              </div>
              <div className="h-[180px] shrink-0">
                <OperationalCharts />
              </div>
            </div>

            {/* Telemetry Detail HUD Panel (1/4 Column) */}
            <div className="lg:col-span-1 h-full min-h-0">
              <IntelligencePanel />
            </div>
            
          </div>
        ) : (
          /* 2. STUDENT, PARENT, OR DRIVER MOBILE SPLIT VIEW */
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            
            {/* Live Map (Left Side) */}
            <div className="h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative min-h-[300px]">
              <LiveMap />
            </div>

            {/* Dedicated Role Console Panel (Right Side) */}
            <div className="h-full min-h-0">
              {activeRole === "student" && <StudentTracker />}
              {activeRole === "parent" && <ParentSafetyHub />}
              {activeRole === "driver" && <DriverConsole />}
            </div>

          </div>
        )}

      </div>

      {/* Floating Global Systems widgets */}
      <NotificationEngine />
      <AiChatBot />

      {/* Global Flashing Critical SOS Distress Overlay Shield */}
      {sosTriggered && (
        <div 
          onClick={() => setSosTriggered(false)}
          className="fixed inset-0 bg-rose-950/80 z-[99999] backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 border-8 border-rose-600 animate-pulse pointer-events-auto cursor-pointer"
        >
          <div className="w-24 h-24 rounded-full bg-rose-600 flex items-center justify-center text-5xl text-white mb-6 shadow-neon-rose animate-bounce">
            🚨
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase drop-shadow-lg">
            CRITICAL SOS BROADCAST
          </h1>
          <p className="text-xs md:text-sm font-extrabold text-rose-200 tracking-widest mt-4 uppercase max-w-md">
            Distress signal actively transmitting. Campus safety and administrators have been dispatched. Tap anywhere to clear broadcast state.
          </p>
          <div className="mt-8 text-[10px] font-black tracking-wider text-rose-400/60 uppercase">
            CampusFlow Emergency Network
          </div>
        </div>
      )}

    </main>
  )
}
