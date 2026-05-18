"use client"

import { useBusStore } from "@/store/busStore"

export default function ParentSafetyHub() {
  const { attendanceLogs, notifications, addNotification, buses, selectedBusId } = useBusStore()

  const activeBus = buses.find((b) => b.busId === selectedBusId) || buses[0]

  // Parents manual incident trigger simulators
  const triggerSimulatedIncident = (type: "Overspeed" | "Route Deviation") => {
    if (type === "Overspeed") {
      addNotification(
        `Safety Alert: AI Telemetry detects overspeed warning for ${activeBus.busId} (Cruising at 62 km/h).`,
        "warning",
        activeBus.busId
      )
    } else {
      addNotification(
        `Security Alert: Route deviation alert triggered on ${activeBus.busId}. Dispatch review scheduled.`,
        "error",
        activeBus.busId
      )
    }
  }

  const triggerCallDriver = () => {
    alert(`[Simulating Outbound Dial] Connecting call to Ramesh Kumar (${activeBus.driver.phone}) via campus secure VoIP line...`)
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto no-scrollbar select-none min-h-0">
      
      {/* COLUMN 1: Child Live Tracking & Metrics (7 columns) */}
      <div className="lg:col-span-7 flex flex-col gap-4 pr-0 lg:pr-3 border-r-0 lg:border-r border-white/5 justify-between">
        
        <div className="flex justify-between items-center pb-2 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Parent Security Center</h2>
            <h3 className="text-sm font-black text-white mt-0.5">CHILD TRACKING FEED</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black">
            CHILD BOARDED
          </span>
        </div>

        {/* 1. Child Tracking Tile */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 bg-slate-950/40 space-y-3 shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👦</span>
              <div>
                <h4 className="text-xs font-black text-slate-200">Aditya Verma (IIT2023042)</h4>
                <p className="text-[8px] text-slate-500 font-bold mt-1">Bus Route: Hitech City Express</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Boarded Stop</span>
              <span className="text-xs font-extrabold text-cyan-400 block mt-0.5">Gachibowli DLF</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/3 text-[9px] font-bold text-slate-400">
            <div>
              <span className="text-slate-500 block uppercase">Boarding Status</span>
              <span className="text-emerald-400 block mt-0.5">Boarded (11:15 AM)</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">Shuttle ETA</span>
              <span className="text-cyan-400 block mt-0.5 font-mono">{activeBus.etaMinutes} mins remaining</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">Vehicle Speed</span>
              <span className="text-slate-200 block mt-0.5 font-mono">{activeBus.speed} km/h</span>
            </div>
          </div>
        </div>

        {/* 2. Direct Driver Contact Panel */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/5 bg-slate-900/10 shrink-0 space-y-3">
          <span className="text-[9px] font-black text-purple-400 tracking-widest block uppercase">Assigned Driver Contact</span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-lg">
                👨‍✈️
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-200">{activeBus.driver.name}</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{activeBus.driver.phone}</p>
              </div>
            </div>
            <button
              onClick={triggerCallDriver}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-black uppercase hover:bg-purple-500/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              📞 Direct Call
            </button>
          </div>
        </div>

        {/* 3. Safety KPI Checklist */}
        <div className="space-y-2 shrink-0">
          <span className="text-[9px] font-black text-slate-500 tracking-wider block uppercase">Vehicle Safety Metrics</span>
          
          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
            <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/20 flex items-center justify-between">
              <span className="text-slate-400">Speed Buffer</span>
              <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">SAFE (&lt;55 km/h)</span>
            </div>
            <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/20 flex items-center justify-between">
              <span className="text-slate-400">Route Deviations</span>
              <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">EN ROUTE</span>
            </div>
          </div>
        </div>

        {/* 4. Incident Trigger Simulator widget */}
        <div className="glass-panel p-3 rounded-xl border border-white/5 bg-slate-950/20 shrink-0">
          <span className="text-[9px] font-bold text-slate-500 tracking-wider block mb-2 uppercase">
            Simulate safety warning notification
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => triggerSimulatedIncident("Overspeed")}
              className="py-2 rounded-lg text-[9px] font-black tracking-wider uppercase border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 active:scale-95 transition-all"
            >
              ⚠️ Simulate Overspeed
            </button>
            <button
              onClick={() => triggerSimulatedIncident("Route Deviation")}
              className="py-2 rounded-lg text-[9px] font-black tracking-wider uppercase border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all"
            >
              🚨 Simulate Deviation
            </button>
          </div>
        </div>

      </div>

      {/* COLUMN 2: Attendance Logs (5 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-4 justify-between h-full min-h-0">
        <div>
          <h4 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Daily travel logs</h4>
          <h3 className="text-xs font-black text-cyan-400 mt-0.5">NFC / RFID SCAN LOGS</h3>
        </div>

        {/* Boarding Logs List timeline */}
        <div className="flex-1 min-h-[220px] overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
          {attendanceLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-white/3 bg-white/2 flex justify-between items-center transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-sm shrink-0">
                  {log.type === "RFID Tap" ? "💳" : log.type === "QR Scan" ? "📷" : "📱"}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{log.studentName}</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {log.rollNumber} ➔ Checked in on <span className="text-cyan-400 font-extrabold">{log.busId}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-slate-400 block font-mono">{log.timestamp}</span>
                <span className="text-[8px] font-extrabold text-slate-500 tracking-wide block mt-0.5">
                  {log.stopName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
