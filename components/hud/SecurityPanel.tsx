"use client"

import { useState } from "react"
import { useBusStore } from "@/store/busStore"

export default function SecurityPanel() {
  const {
    buses,
    sosTriggered,
    setSosTriggered,
    notifications,
    addNotification,
  } = useBusStore()

  // CCTV active mock states
  const [selectedCamera, setSelectedCamera] = useState("BUS-104")
  const [cctvFaulty, setCctvFaulty] = useState(false)

  // Incident log states
  const securityIncidents = notifications.filter(
    (n) => n.severity === "error" || n.severity === "warning"
  )

  const dispatchEmergencyResponse = (busId?: string) => {
    addNotification(
      `Security Command: Dispatch Patrol Car #09 deployed to assist ${busId || "fleet shuttle"}.`,
      "success"
    )
    alert(`[Security HQ Alert] Emergency patrol car dispatched to assist ${busId || "shuttle"}!`)
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 select-none p-1">
      
      {/* LEFT COLUMN: CCTV Stream Surveillance (7 columns) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* 1. CCTV active stream box */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="text-[9px] font-black text-rose-400 tracking-widest block uppercase">CCTV STREAM SURVEILLANCE</span>
              <h3 className="text-sm font-black text-white uppercase mt-0.5">Live Vehicle Cabin Surveillance</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[9px] font-black animate-pulse">LIVE RECORING</span>
          </div>

          {/* Grid representing visual camera feed */}
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-white/5 overflow-hidden flex flex-col justify-between p-4">
            
            {/* Visual scanlines & camera box */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/1 via-transparent to-black/10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>

            {/* Top row overlays */}
            <div className="flex justify-between items-center z-10">
              <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold tracking-wider font-mono">
                CAMERA: {selectedCamera} (CABIN_01)
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-white/5 text-[9px] font-bold font-mono">
                <span className={`w-2 h-2 rounded-full ${cctvFaulty ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-pulse"}`}></span>
                <span className={cctvFaulty ? "text-rose-400" : "text-emerald-400"}>
                  {cctvFaulty ? "CCTV FAULT" : "CCTV ACTIVE"}
                </span>
              </div>
            </div>

            {/* Center screen grid rendering mock people vectors */}
            <div className="flex-1 flex items-center justify-center relative">
              {cctvFaulty ? (
                <div className="text-center space-y-2">
                  <span className="text-3xl">⚠️</span>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Video signal feed lost</p>
                  <p className="text-[8px] text-slate-500 font-semibold">Tire pressure warning or power disruption</p>
                </div>
              ) : (
                /* Dynamic mock cabin occupancy vectors */
                <div className="text-center space-y-3">
                  <span className="text-4xl animate-bounce">🚍👨‍✈️🧑‍🤝‍🧑</span>
                  <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-400 font-mono">
                    <span>FPS: 30.0</span>
                    <span>BITRATE: 4120 kbps</span>
                    <span>RESOLUTION: 1080p</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row overlays */}
            <div className="flex justify-between items-center z-10">
              <span className="text-[8px] font-bold text-slate-500 tracking-wider">HYDERABAD CAMPUS TRANSIT SURVEILLANCE</span>
              <span className="text-[9px] font-bold text-slate-400 font-mono">12:15:44 PM • SECURE FEED</span>
            </div>

          </div>

          {/* Quick Select Camera */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Select Active Camera Stream</span>
            <div className="flex flex-wrap gap-2">
              {buses.map((bus) => (
                <button
                  key={bus.busId}
                  onClick={() => {
                    setSelectedCamera(bus.busId)
                    setCctvFaulty(bus.busId === "BUS-500") // Simulate left rear tyre pressure fault causing camera lost
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                    selectedCamera === bus.busId
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  📹 {bus.busId}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Emergency Dispatch Desk & Incidents feed (5 columns) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* 1. Emergency Dispatch SOS triggers */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div>
            <span className="text-[9px] font-black text-rose-400 tracking-widest block uppercase">EMERGENCY DISPATCH CONSOLE</span>
            <h3 className="text-sm font-black text-white uppercase mt-0.5">SOS Emergency Surveillance</h3>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-center space-y-3">
            <span className="text-3xl block animate-bounce">🚨</span>
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest">
              {sosTriggered ? "🚨 DISTRESS SIREN BROADCASTING" : "NO ACTIVE SOS ALARM"}
            </h4>
            <p className="text-[8px] text-slate-500 font-semibold leading-relaxed">
              Active campus distress indicators will overlay panels on student, parent, driver, and administration dashboards immediately.
            </p>
            
            <div className="flex gap-2 justify-center">
              {sosTriggered ? (
                <button
                  onClick={() => {
                    setSosTriggered(false)
                    addNotification("Security HQ: SOS emergency broadcast cleared successfully.", "success")
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-black uppercase active:scale-95 transition-all"
                >
                  Clear Distress
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSosTriggered(true)
                    addNotification("Security HQ: SOS distress override broadcast activated globally.", "error")
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] font-black uppercase active:scale-95 transition-all animate-pulse"
                >
                  Trigger Override SOS
                </button>
              )}
              <button
                onClick={() => dispatchEmergencyResponse(selectedCamera)}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[9px] font-black uppercase active:scale-95 transition-all"
              >
                Dispatch Patrol
              </button>
            </div>
          </div>
        </div>

        {/* 2. Security Incident Log */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div>
            <span className="text-[9px] font-black text-amber-400 tracking-widest block uppercase">SECURITY SURVEILLANCE ALERTS</span>
            <h3 className="text-sm font-black text-white uppercase mt-0.5">Telematic Security Registers</h3>
          </div>

          <div className="max-h-[160px] overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
            {securityIncidents.length > 0 ? (
              securityIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-3 rounded-xl border border-white/3 bg-slate-950/40 space-y-2 text-[10px] font-bold"
                >
                  <div className="flex justify-between items-center border-b border-white/3 pb-1">
                    <span className={incident.severity === "error" ? "text-rose-400" : "text-amber-400"}>
                      {incident.severity === "error" ? "⚠️ CRITICAL ALERT" : "⚠️ INCIDENT WARNING"}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">{incident.timestamp}</span>
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed">{incident.message}</p>
                  
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => dispatchEmergencyResponse(incident.busId)}
                      className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase hover:bg-cyan-500/20 active:scale-95 transition-all"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-[10px] font-bold">
                No telemetry speed or route deviation alerts recorded en-route.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
