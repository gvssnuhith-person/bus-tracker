"use client"

import { useState } from "react"
import { useBusStore } from "@/store/busStore"

export default function DriverConsole() {
  const {
    buses,
    routes,
    selectedBusId,
    setSelectedBusId,
    addAttendanceLog,
    addNotification,
    sosTriggered,
    setSosTriggered,
    driverCompletedStops,
    toggleDriverStop,
  } = useBusStore()

  // Selected Student
  const [selectedStudent, setSelectedStudent] = useState("Aarav Patel")
  const [selectedRoll, setSelectedRoll] = useState("IIT2023089")

  // Trip State Actions
  const [tripState, setTripState] = useState<"idle" | "running" | "paused">("idle")

  const activeBus = buses.find((b) => b.busId === selectedBusId) || buses[0]
  const route = routes.find((r) => r.id === activeBus.routeId)

  // Student roster
  const students = [
    { name: "Aarav Patel", roll: "IIT2023089" },
    { name: "Riya Sen", roll: "IIT2023154" },
    { name: "Divya Nair", roll: "IIT2023004" },
    { name: "Karan Johar", roll: "IIT2023075" },
    { name: "Meera Bai", roll: "IIT2023112" },
  ]

  const handleStudentSelect = (name: string) => {
    const student = students.find((s) => s.name === name)
    if (student) {
      setSelectedStudent(student.name)
      setSelectedRoll(student.roll)
    }
  }

  // Trigger simulated RFID card check-in
  const triggerRfidBoarding = (type: "RFID Tap" | "QR Scan" | "NFC Detect") => {
    addAttendanceLog({
      studentName: selectedStudent,
      rollNumber: selectedRoll,
      busId: activeBus.busId,
      stopName: activeBus.nextStop,
      type,
    })

    const msg = `Smart Boarding: ${selectedStudent} checked in on ${activeBus.busId} at ${activeBus.nextStop} via ${type}.`
    addNotification(msg, "success", activeBus.busId)

    // Sound chime
    if (typeof window !== "undefined") {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(880, audioCtx.currentTime)
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.15)
    }
  }

  // Trigger pilot SOS emergency alert
  const triggerDriverSos = () => {
    const newStatus = !sosTriggered
    setSosTriggered(newStatus)

    if (newStatus) {
      addNotification(
        `CRITICAL WARNING: Driver Ramesh Kumar has broadcasted an active SOS Distress Signal on ${activeBus.busId}.`,
        "error",
        activeBus.busId
      )
    } else {
      addNotification(`SOS Distress Cleared by Dispatch on ${activeBus.busId}.`, "info", activeBus.busId)
    }
  }

  const triggerIncidentReport = (type: "breakdown" | "traffic" | "accident") => {
    const msg = `Security Alert: Driver Ramesh reported ${type.toUpperCase()} en-route on ${activeBus.busId}.`
    addNotification(msg, "error", activeBus.busId)
    alert(`[Security Alert Logged] ${type.toUpperCase()} incident report dispatched to HQ!`)
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto no-scrollbar select-none min-h-0">
      
      {/* COLUMN 1: Trip Checklist & Guidance (7 columns) */}
      <div className="lg:col-span-7 flex flex-col gap-4 pr-0 lg:pr-3 border-r-0 lg:border-r border-white/5 justify-between">
        
        <div className="pb-3 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Trip Guidance Console</h2>
            <h3 className="text-sm font-black text-white mt-0.5">STOP CHECKLIST PROGRESS</h3>
          </div>
          <select
            value={selectedBusId || ""}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="glass-input text-[10px] px-2 py-1 rounded-lg font-bold text-cyan-400"
          >
            {buses.map((b) => (
              <option key={b.busId} value={b.busId} className="bg-slate-950 text-slate-200">
                {b.busId} ({b.route.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>

        {/* 1. Trip Phase Selectors (Start, Pause, End) */}
        <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/10 shrink-0 space-y-3">
          <span className="text-[9px] font-black text-cyan-400 tracking-widest block uppercase">Trip Phase Controls</span>
          <div className="grid grid-cols-3 gap-2 text-[9px] font-black uppercase">
            <button
              onClick={() => {
                setTripState("running")
                addNotification(`Driver: Ramesh Kumar initiated morning trip on ${activeBus.busId}.`, "success")
              }}
              className={`py-2 rounded-lg border transition-all ${
                tripState === "running" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-slate-950 border-white/5 text-slate-500"
              }`}
            >
              ▶️ Start Trip
            </button>
            <button
              onClick={() => {
                setTripState("paused")
                addNotification(`Driver: Ramesh Kumar paused active trip coordinates on ${activeBus.busId}.`, "warning")
              }}
              className={`py-2 rounded-lg border transition-all ${
                tripState === "paused" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-slate-950 border-white/5 text-slate-500"
              }`}
            >
              ⏸️ Pause Trip
            </button>
            <button
              onClick={() => {
                setTripState("idle")
                addNotification(`Driver: Ramesh Kumar completed en-route drop-offs on ${activeBus.busId}.`, "info")
              }}
              className={`py-2 rounded-lg border transition-all bg-slate-950 border-white/5 text-slate-500`}
            >
              ⏹️ End Trip
            </button>
          </div>
        </div>

        {/* 2. Route Stops Checklist */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1 no-scrollbar min-h-[140px]">
          {route?.stops.map((stop, idx) => {
            const isCompleted = driverCompletedStops.includes(stop.name)
            return (
              <div
                key={idx}
                onClick={() => {
                  toggleDriverStop(stop.name)
                  const msg = isCompleted
                    ? `Driver cancelled stop checking for ${stop.name} on ${activeBus.busId}.`
                    : `Driver verified stop arrival at ${stop.name} on ${activeBus.busId}. Boarding timeline synced.`
                  addNotification(msg, isCompleted ? "info" : "success", activeBus.busId)
                }}
                className={`p-3 rounded-xl cursor-pointer border flex justify-between items-center transition-all ${
                  isCompleted
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-bold"
                    : "bg-white/2 border-white/3 hover:bg-white/4 hover:border-white/5 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center font-bold text-[9px] ${
                    isCompleted ? "border-emerald-500 bg-emerald-500/20" : "border-slate-600"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide">{stop.name}</h4>
                    <p className="text-[8px] text-slate-500 mt-0.5">Tap to log arrival checkout</p>
                  </div>
                </div>
                {isCompleted && (
                  <span className="text-[8px] font-black tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    VERIFIED
                  </span>
                )}
              </div>
            )
          })}
        </div>

      </div>

      {/* COLUMN 2: NFC Scanner & Emergency Reporting Desk (5 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-4 justify-between h-full min-h-0">
        
        {/* 1. Roster NFC smart scanner */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col justify-between gap-3 bg-slate-950/20 shrink-0">
          <div>
            <h4 className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">NFC/RFID Scanner Boarding Hub</h4>
            <h3 className="text-xs font-black text-cyan-400 mt-0.5">SMART SCAN SIMULATOR</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[8px] font-bold text-slate-400 block uppercase mb-1">
                Select Roster Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full glass-input text-xs px-3 py-2 rounded-xl text-slate-200 bg-slate-950"
              >
                {students.map((std) => (
                  <option key={std.name} value={std.name} className="bg-slate-950 text-slate-200">
                    {std.name} ({std.roll})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => triggerRfidBoarding("RFID Tap")}
                className="py-2 rounded-xl text-[8px] font-black tracking-wider uppercase border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all"
              >
                💳 RFID Tap
              </button>
              <button
                onClick={() => triggerRfidBoarding("QR Scan")}
                className="py-2 rounded-xl text-[8px] font-black tracking-wider uppercase border border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 active:scale-95 transition-all"
              >
                📷 QR Scan
              </button>
              <button
                onClick={() => triggerRfidBoarding("NFC Detect")}
                className="py-2 rounded-xl text-[8px] font-black tracking-wider uppercase border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all"
              >
                📱 NFC Board
              </button>
            </div>
          </div>
        </div>

        {/* 2. Telemetry Incident Report Desk */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/5 bg-slate-900/10 shrink-0 space-y-2.5">
          <span className="text-[9px] font-black text-amber-400 tracking-widest block uppercase">Telemetry Incident Reporter</span>
          <div className="grid grid-cols-3 gap-2 text-[8px] font-black uppercase text-center">
            <button
              onClick={() => triggerIncidentReport("breakdown")}
              className="py-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all"
            >
              🚨 Breakdown
            </button>
            <button
              onClick={() => triggerIncidentReport("traffic")}
              className="py-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              ⚠️ Traffic
            </button>
            <button
              onClick={() => triggerIncidentReport("accident")}
              className="py-2 rounded bg-red-600/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 active:scale-95 transition-all"
            >
              💥 Accident
            </button>
          </div>
        </div>

        {/* 3. Driver SOS Broadcasting warning keys */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-2.5 bg-rose-950/5 shrink-0">
          <button
            onClick={triggerDriverSos}
            className={`w-full py-3.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 active:scale-95 ${
              sosTriggered
                ? "bg-rose-600 text-white border-2 border-white shadow-neon-rose animate-pulse"
                : "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-inner"
            }`}
          >
            🚨 {sosTriggered ? "SOS ACTIVE DISTRESS" : "TRIGGER DISTRESS SOS"}
          </button>
        </div>

      </div>

    </div>
  )
}
