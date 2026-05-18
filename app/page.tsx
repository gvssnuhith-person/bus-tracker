"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useBusStore } from "@/store/busStore"
import { startSimulation, stopSimulation } from "@/lib/simulator/gpsEngine"

// Global Auth & Layout Panels
import LoginPortal from "@/components/auth/LoginPortal"
import RoleConsole from "@/components/dashboard/RoleConsole"
import FleetOverview from "@/components/buses/FleetOverview"
import IntelligencePanel from "@/components/hud/IntelligencePanel"
import OperationalCharts from "@/components/charts/OperationalCharts"
import NotificationEngine from "@/components/ui/NotificationEngine"
import AiChatBot from "@/components/ai/AiChatBot"

// Role Dashboard Panels
import DriverConsole from "@/components/buses/DriverConsole"
import StudentTracker from "@/components/hud/StudentTracker"
import ParentSafetyHub from "@/components/hud/ParentSafetyHub"
import TransportHeadPanel from "@/components/hud/TransportHeadPanel"
import SecurityPanel from "@/components/hud/SecurityPanel"

// Load Map dynamically to avoid SSR window Leaflet issues
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
  const { loggedInUser, activeRole, isSimulating, simSpeed, sosTriggered, setSosTriggered, theme } = useBusStore()

  // Start telemetry simulator
  useEffect(() => {
    startSimulation()
    return () => {
      stopSimulation()
    }
  }, [])

  // Restart simulator when simulation settings update
  useEffect(() => {
    stopSimulation()
    if (isSimulating) {
      startSimulation()
    }
  }, [isSimulating, simSpeed])

  // If user is not authenticated: Show the gorgeous Startup Landing Page & Portal
  if (!loggedInUser) {
    return <LoginPortal />
  }

  // Active Role Panels routing
  const renderRoleDashboard = () => {
    switch (activeRole) {
      case "student":
        return <StudentTracker />
      case "parent":
        return <ParentSafetyHub />
      case "driver":
        return <DriverConsole />
      case "manager":
        return <TransportHeadPanel />
      case "security":
        return <SecurityPanel />
      default:
        return null
    }
  }

  return (
    <main className={`relative min-h-screen w-full overflow-hidden flex flex-col p-4 gap-4 antialiased transition-all duration-300 ${
      theme === "light" 
        ? "bg-slate-50 text-slate-900" 
        : "bg-slate-950 text-slate-100"
    }`}>
      
      {/* Global CSS particle layer (only for Dark mode) */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none z-0"></div>
      )}

      {/* Dynamic Global Header (Branding, Role Switch, Search, Theme toggle) */}
      <div className="z-10 shrink-0">
        <RoleConsole />
      </div>

      {/* Main Swappable Role Workspace Grid */}
      <div className="flex-1 min-h-0 z-10">
        
        {activeRole === "admin" ? (
          /* A. ADMIN CONSOLE: Dynamic Command Center Grid */
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
            
            {/* Left Col: Fleet Overview (1/4) */}
            <div className="lg:col-span-1 h-full min-h-0">
              <FleetOverview />
            </div>

            {/* Center Col: Map & Recharts Streams (2/4) */}
            <div className="lg:col-span-2 h-full flex flex-col gap-4 min-h-0">
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative min-h-[300px]">
                <LiveMap />
              </div>
              <div className="h-[180px] shrink-0">
                <OperationalCharts />
              </div>
            </div>

            {/* Right Col: Admin Manager Control board (1/4) */}
            <div className="lg:col-span-1 h-full min-h-0">
              <IntelligencePanel />
            </div>
            
          </div>
        ) : (
          /* B. DEDICATED MOBILES ROLE PANELS (Student, Parent, Driver, Transport Head, Security Staff) */
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
            
            {/* Left Side: Live Dark Map (7 columns) */}
            <div className="lg:col-span-7 h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative min-h-[300px]">
              <LiveMap />
            </div>

            {/* Right Side: Swappable Dashboard Console (5 columns) */}
            <div className="lg:col-span-5 h-full min-h-0">
              {renderRoleDashboard()}
            </div>

          </div>
        )}

      </div>

      {/* Floating global systems widgets */}
      <NotificationEngine />
      <AiChatBot />

      {/* Emergency Distress Overlay screen */}
      {sosTriggered && (
        <div 
          onClick={() => setSosTriggered(false)}
          className="fixed inset-0 bg-rose-950/80 z-[99999] backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 border-8 border-rose-600 animate-pulse pointer-events-auto cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-4xl text-white mb-6 shadow-neon-rose animate-bounce">
            🚨
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-widest text-white uppercase drop-shadow-lg">
            CRITICAL SOS BROADCAST
          </h1>
          <p className="text-[10px] md:text-xs font-extrabold text-rose-200 tracking-widest mt-4 uppercase max-w-md">
            Distress signal actively transmitting. Campus safety and administrators have been dispatched. Tap anywhere to clear broadcast state.
          </p>
          <div className="mt-8 text-[9px] font-black tracking-wider text-rose-400/60 uppercase">
            CampusFlow Emergency Network
          </div>
        </div>
      )}

    </main>
  )
}
