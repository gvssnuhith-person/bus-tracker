"use client"

import { useState } from "react"
import { useBusStore } from "@/store/busStore"

export default function StudentTracker() {
  const { buses, routes, selectedBusId, notifications, addNotification, setSosTriggered } = useBusStore()
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Welcome to CampusFlow AI assistant! Ask me: 'Where is Bus 104?', 'ETA to Jubilee Hills?', or 'Show active alerts'." },
  ])
  const [inputValue, setInputValue] = useState("")

  const activeBus = buses.find((b) => b.busId === selectedBusId) || buses[0]
  const route = routes.find((r) => r.id === activeBus.routeId)
  const color = route ? route.color : "#00f0ff"

  // Simple client-side NLP query parsing
  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return

    const newMessages = [...messages, { sender: "user" as const, text: queryText }]
    setMessages(newMessages)
    setInputValue("")

    setTimeout(() => {
      const lower = queryText.toLowerCase()
      let reply = ""

      if (lower.includes("bus-104") || lower.includes("bus 104")) {
        const bus104 = buses.find((b) => b.busId === "BUS-104")
        reply = bus104
          ? `Bus H-104 is cruising at ${bus104.speed} km/h, next stop is ${bus104.nextStop} (ETA ${bus104.etaMinutes} mins). Battery is at ${Math.round(bus104.fuelLevel)}%.`
          : "Bus 104 is currently offline."
      } else if (lower.includes("alert") || lower.includes("warning") || lower.includes("incident")) {
        const warnings = notifications.filter((n) => n.severity === "error" || n.severity === "warning")
        if (warnings.length > 0) {
          reply = `I detect ${warnings.length} active safety alert(s). The latest: "${warnings[0].message}"`
        } else {
          reply = "All systems are normal. No active safety alerts or route delays detected."
        }
      } else if (lower.includes("fastest") || lower.includes("speed")) {
        const maxSpeedBus = [...buses].sort((a, b) => b.speed - a.speed)[0]
        reply = `The fastest bus in the fleet is currently ${maxSpeedBus.busId} travelling at ${maxSpeedBus.speed} km/h along the ${maxSpeedBus.route.split(" ")[0]} route.`
      } else if (lower.includes("delay") || lower.includes("traffic")) {
        const delayed = buses.filter((b) => b.status !== "on-time")
        if (delayed.length > 0) {
          reply = `Currently, ${delayed.length} vehicles are reporting delays. ${delayed.map((b) => `${b.busId} (${b.status})`).join(", ")}.`
        } else {
          reply = "Excellent news! All active campus shuttles are currently running exactly on schedule."
        }
      } else if (lower.includes("eta") || lower.includes("next stop") || lower.includes("where")) {
        reply = `Your selected shuttle ${activeBus.busId} is travelling at ${activeBus.speed} km/h. It is heading to ${activeBus.nextStop} with an estimated arrival time of ${activeBus.etaMinutes} minutes.`
      } else {
        reply = "I parsed your query but couldn't map the exact telematics. Try: 'Where is Bus 104?', 'Which bus is fastest?', or 'Show delayed buses'."
      }

      setMessages((prev) => [...prev, { sender: "bot" as const, text: reply }])
    }, 850)
  }

  const handleStudentSos = () => {
    setSosTriggered(true)
    addNotification(`Critical: Day Scholar student Siddharth Sen triggered SOS alarm beacon!`, "error", activeBus.busId)
    alert("[SOS Emergency Beacon] Security command and emergency patrols notified immediately!")
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto no-scrollbar select-none min-h-0">
      
      {/* LEFT PANEL: Boarding Ticket, Profile & Schedules (7 columns) */}
      <div className="lg:col-span-7 flex flex-col gap-5 justify-between pr-0 lg:pr-3 border-r-0 lg:border-r border-white/5">
        
        {/* Ticket Title */}
        <div className="flex justify-between items-center pb-2 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Smart Campus Tracker</h2>
            <h3 className="text-sm font-black text-white mt-0.5">ACTIVE BOARDING TICKET</h3>
          </div>
          {/* Day Scholar Profile Badge */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg text-right shrink-0">
            <span className="text-[9px] font-black text-cyan-400 tracking-wider block uppercase">DAY SCHOLAR</span>
          </div>
        </div>

        {/* 2. Apple Wallet Style QR Ticket */}
        <div className="relative p-4 rounded-xl border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl overflow-hidden flex flex-col justify-between items-center text-center gap-3 py-6 shrink-0"
          style={{ borderColor: `${color}30` }}>
          
          <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: color }}></div>
          <div className="absolute top-0 bottom-0 right-0 w-1" style={{ backgroundColor: color }}></div>

          <div className="flex justify-between items-center w-full pb-2.5 border-b border-white/5">
            <div className="text-left">
              <span className="text-[8px] font-bold text-slate-500 tracking-wider block">STUDENT PASS</span>
              <span className="text-xs font-black text-white">Siddharth Sen</span>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-bold text-slate-500 tracking-wider block">ROLL NO</span>
              <span className="text-xs font-mono font-black text-cyan-400">IIT2023089</span>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full py-2">
            {/* QR Code */}
            <div className="relative w-28 h-28 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ boxShadow: `0 0 20px ${color}20` }}>
              <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-950">
                <rect x="0" y="0" width="25" height="25" />
                <rect x="5" y="5" width="15" height="15" fill="white" />
                <rect x="75" y="0" width="25" height="25" />
                <rect x="80" y="5" width="15" height="15" fill="white" />
                <rect x="0" y="75" width="25" height="25" />
                <rect x="5" y="80" width="15" height="15" fill="white" />
                <rect x="35" y="35" width="30" height="30" />
                <rect x="40" y="40" width="20" height="20" fill="white" />
                <rect x="45" y="45" width="10" height="10" />
                <rect x="10" y="30" width="10" height="20" />
                <rect x="80" y="30" width="10" height="20" />
                <rect x="30" y="10" width="20" height="10" />
                <rect x="30" y="80" width="20" height="10" />
              </svg>
              <div className="absolute inset-0 rounded-xl border-2 animate-pulse pointer-events-none" style={{ borderColor: color }}></div>
            </div>

            {/* Student ID Details */}
            <div className="flex-1 space-y-2 text-left text-[10px] font-bold text-slate-300">
              <div className="grid grid-cols-2 gap-2 border-b border-white/3 pb-1">
                <span className="text-slate-500">ASSIGNED</span>
                <span className="text-slate-200" style={{ color: color }}>{activeBus.busId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-white/3 pb-1">
                <span className="text-slate-500">LINE</span>
                <span className="text-slate-200 truncate">{activeBus.route.split(" ")[0]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-500">ATTENDANCE</span>
                <span className="text-emerald-400">Boarded (11:15 AM)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full pt-2 border-t border-white/5">
            <span className="text-[8px] font-bold text-slate-500 tracking-wider">BOARDING AUTOLOG ACTIVE</span>
            <span className="text-[9px] font-bold text-cyan-400 font-mono">RFID EN-ROUTE</span>
          </div>
        </div>

        {/* 3. Schedules (Morning & Evening timings) */}
        <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/10 shrink-0">
          <span className="text-[9px] font-black text-purple-400 tracking-widest block uppercase mb-2">Morning & Evening schedules</span>
          <div className="grid grid-cols-2 gap-3 text-[9px] font-bold text-slate-300">
            <div className="bg-slate-950/40 p-2 rounded-lg border border-white/3">
              <span className="text-slate-500 uppercase block mb-1">🌅 Morning Ride</span>
              <div className="flex justify-between">
                <span>Pickup DLF Stop</span>
                <span className="text-cyan-400 font-mono">07:45 AM</span>
              </div>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-white/3">
              <span className="text-slate-500 uppercase block mb-1">🌇 Evening Return</span>
              <div className="flex justify-between">
                <span>Drop-off DLF Stop</span>
                <span className="text-purple-400 font-mono">04:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SOS distress button */}
        <button
          onClick={handleStudentSos}
          className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 tracking-widest shrink-0"
        >
          🚨 ONE-CLICK EMERGENCY SOS BEACON
        </button>

      </div>

      {/* RIGHT PANEL: Weather Advisory & Voice Terminal (5 columns) */}
      <div className="lg:col-span-5 flex flex-col gap-4 justify-between h-full min-h-0">
        
        {/* 1. Dynamic Weather Station Card */}
        <div className="glass-panel p-3.5 rounded-xl border border-white/5 bg-slate-900/10 space-y-2 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-amber-400 tracking-widest block uppercase">LIVE CLIMATE ADVISORY</span>
            <span className="text-[9px] font-mono text-slate-400 font-bold">29°C • Rain Alert</span>
          </div>

          <div className="p-2.5 rounded-lg border border-amber-500/10 bg-amber-500/5 flex gap-3 items-center text-[10px] font-bold">
            <span className="text-2xl">🌦️</span>
            <div>
              <span className="text-amber-400 uppercase block">Wet Road warning active</span>
              <p className="text-[8px] text-slate-500 mt-0.5 leading-relaxed">Rain warning detected en-route. Campus fleet speeds dampener enabled (Reduced by 15%).</p>
            </div>
          </div>
        </div>

        {/* 2. Dialogues Assistant List */}
        <div className="flex-1 min-h-[160px] overflow-y-auto p-3 rounded-xl glass-panel border border-white/5 flex flex-col gap-2.5 no-scrollbar">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === "bot"
            return (
              <div
                key={idx}
                className={`max-w-[90%] p-2 rounded-xl text-[10px] font-semibold leading-relaxed transition-all ${
                  isBot
                    ? "bg-slate-900 border border-white/5 text-slate-300 self-start"
                    : "bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 self-end"
                }`}
              >
                {msg.text}
              </div>
            )
          })}
        </div>

        {/* Suggestions chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none py-1 text-[9px] font-bold">
          <button
            onClick={() => handleQuery("Where is Bus 104?")}
            className="px-2.5 py-1 rounded-lg border border-white/5 bg-white/2 text-slate-400 hover:text-slate-200 hover:bg-white/4 whitespace-nowrap"
          >
            📍 Bus 104?
          </button>
          <button
            onClick={() => handleQuery("Show active alerts")}
            className="px-2.5 py-1 rounded-lg border border-white/5 bg-white/2 text-slate-400 hover:text-slate-200 hover:bg-white/4 whitespace-nowrap"
          >
            🚨 Active alerts?
          </button>
        </div>

        {/* Input box */}
        <div className="flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Query dispatch copilot..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuery(inputValue)
            }}
            className="flex-1 glass-input text-xs px-3 py-2 rounded-xl font-semibold"
          />
          <button
            onClick={() => handleQuery(inputValue)}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black hover:bg-cyan-500/30 active:scale-95 transition-all"
          >
            SEND
          </button>
        </div>

      </div>

    </div>
  )
}
