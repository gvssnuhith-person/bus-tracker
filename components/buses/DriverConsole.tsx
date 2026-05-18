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

  const [selectedStudent, setSelectedStudent] = useState("Aarav Patel")
  const [selectedRoll, setSelectedRoll] = useState("IIT2023089")

  const activeBus = buses.find((b) => b.busId === selectedBusId) || buses[0]
  const route = routes.find((r) => r.id === activeBus.routeId)

  // Student roster for simulator taps
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

    // Simulate passenger count increment
    useBusStore.setState((state) => ({
      buses: state.buses.map((b) =>
        b.busId === activeBus.busId
          ? { ...b, passengers: Math.min(b.capacity, b.passengers + 1) }
          : b
      ),
    }))

    // Sound chime
    if (typeof window !== "undefined") {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(880, audioCtx.currentTime) // High chime A5
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
        `CRITICAL WARNING: Driver on ${activeBus.busId} has broadcasted an active SOS Distress Signal.`,
        "error",
        activeBus.busId
      )

      // Speak vocal distress
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(`Warning: Emergency SOS triggered by ${activeBus.busId}`)
        utterance.rate = 1.1
        window.speechSynthesis.speak(utterance)
      }
    } else {
      addNotification(`SOS Distress Cleared by Dispatch on ${activeBus.busId}.`, "info", activeBus.busId)
    }
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto no-scrollbar select-none">
      
      {/* COLUMN 1: Route Guidance Stop Checklist */}
      <div className="flex flex-col gap-4 border-r border-white/5 pr-2">
        <div className="pb-3 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Trip Guidance Console</h2>
            <h3 className="text-sm font-black text-white mt-0.5">STOP CHECKLIST PROGRESS</h3>
          </div>
          <select
            value={selectedBusId || ""}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="glass-input text-xs px-2 py-1 rounded-lg font-bold text-cyan-400"
          >
            {buses.map((b) => (
              <option key={b.busId} value={b.busId} className="bg-slate-950 text-slate-200">
                {b.busId} ({b.route.split(" ")[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Route Stops List */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
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
                className={`p-3 rounded-xl cursor-pointer border flex justify-between items-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-white/2 border-white/3 hover:bg-white/4 hover:border-white/5 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center font-bold text-[10px] ${
                    isCompleted ? "border-emerald-500 bg-emerald-500/20" : "border-slate-600"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide">{stop.name}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Tap to log arrival checkout</p>
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

      {/* COLUMN 2: NFC Boarding simulator and Emergency SOS distress panel */}
      <div className="flex flex-col gap-5 justify-between">
        
        {/* NFC/RFID Smart Scanner Simulator */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col justify-between gap-3 bg-slate-950/20">
          <div>
            <h4 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">NFC/RFID Scanner Boarding Hub</h4>
            <h3 className="text-xs font-black text-cyan-400 mt-0.5">SMART SCAN SIMULATOR</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[9px] font-extrabold text-slate-500 block uppercase mb-1">
                Select Roster Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full glass-input text-xs px-3 py-2 rounded-xl text-slate-200"
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
                className="py-2.5 rounded-xl text-[9px] font-black tracking-wider uppercase border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all"
              >
                💳 RFID Tap
              </button>
              <button
                onClick={() => triggerRfidBoarding("QR Scan")}
                className="py-2.5 rounded-xl text-[9px] font-black tracking-wider uppercase border border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 active:scale-95 transition-all"
              >
                📷 QR Scan
              </button>
              <button
                onClick={() => triggerRfidBoarding("NFC Detect")}
                className="py-2.5 rounded-xl text-[9px] font-black tracking-wider uppercase border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all"
              >
                📱 NFC Board
              </button>
            </div>
          </div>
        </div>

        {/* SOS Emergency distressed panel */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 bg-rose-950/5">
          <div>
            <h4 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Emergency SOS Broadcast System</h4>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">
              Pressing the distress button alerts dispatchers, campus administrators, and broadcasts safety protocols immediately.
            </p>
          </div>

          <button
            onClick={triggerDriverSos}
            className={`w-full max-w-[260px] py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 active:scale-95 ${
              sosTriggered
                ? "bg-rose-600 text-white border-2 border-white shadow-neon-rose scale-105 animate-pulse"
                : "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-inner"
            }`}
            style={{ boxShadow: sosTriggered ? "0 0 25px #ef4444" : "none" }}
          >
            🚨 {sosTriggered ? "SOS BROADCASTING" : "TRIGGER SOS BROADCAST"}
          </button>
        </div>

      </div>
    </div>
  )
}
