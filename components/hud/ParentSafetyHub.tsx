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

    // Play vocal notice
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`Parent Notification: Safety Alert triggered on ${activeBus.busId}`)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto no-scrollbar select-none">
      
      {/* COLUMN 1: Safety Alerts Checklist & Simulator */}
      <div className="flex flex-col gap-4 border-r border-white/5 pr-2 justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Parent Security Center</h2>
          <h3 className="text-sm font-black text-white mt-0.5">VEHICLE SAFETY METRICS</h3>
        </div>

        {/* Safety KPI Checklist */}
        <div className="space-y-3">
          {/* Pick up check */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 text-lg">🛡️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Boarding Status</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">NFC/RFID Checked-in</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              CONFIRMED
            </span>
          </div>

          {/* Speed limit check */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 text-lg">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Speed Control</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Safe operational limits</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded-lg">
              SAFE (&lt;55 km/h)
            </span>
          </div>

          {/* Route path check */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-purple-400 text-lg">🗺️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Route Deviation</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">GPS Snapping coordinates</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded-lg">
              EN ROUTE
            </span>
          </div>
        </div>

        {/* Incident Trigger Simulator widget */}
        <div className="glass-panel p-3 rounded-xl border border-white/5 bg-slate-950/20">
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

        <p className="text-[10px] text-slate-500 text-center font-bold">
          Emergency broadcasts flash-overlay on parent view screen immediately.
        </p>
      </div>

      {/* COLUMN 2: Student Smart Boarding Check-in logs Timeline */}
      <div className="flex flex-col gap-4 justify-between h-full min-h-0">
        <div>
          <h4 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Student Boarding Attendance register</h4>
          <h3 className="text-xs font-black text-cyan-400 mt-0.5">NFC / RFID SCAN LOGS</h3>
        </div>

        {/* Boarding Logs List timeline */}
        <div className="flex-1 min-h-[200px] overflow-y-auto pr-1 space-y-3">
          {attendanceLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-white/3 bg-white/2 flex justify-between items-center transition-all duration-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Visual scanning icon */}
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
