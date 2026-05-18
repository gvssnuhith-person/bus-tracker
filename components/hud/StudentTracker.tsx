"use client"

import { useState } from "react"
import { useBusStore } from "@/store/busStore"

export default function StudentTracker() {
  const { buses, routes, selectedBusId, setSelectedBusId, notifications } = useBusStore()
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

      // Vocal speech synthesis feedback if enabled
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const { voiceEnabled } = useBusStore.getState()
        if (voiceEnabled) {
          const utterance = new SpeechSynthesisUtterance(reply.slice(0, 120))
          window.speechSynthesis.speak(utterance)
        }
      }
    }, 850)
  }

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto no-scrollbar select-none">
      
      {/* COLUMN 1: Smart QR Boarding Pass Ticket */}
      <div className="flex flex-col gap-4 border-r border-white/5 pr-2 justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Smart Campus Tracker</h2>
          <h3 className="text-sm font-black text-white mt-0.5">ACTIVE BOARDING TICKET</h3>
        </div>

        {/* Apple Wallet Style QR Ticket */}
        <div className="relative p-5 rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl overflow-hidden flex flex-col justify-between items-center text-center gap-4 py-8"
          style={{ borderColor: `${color}30` }}>
          
          {/* Neon side bars */}
          <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: color }}></div>
          <div className="absolute top-0 bottom-0 right-0 w-1" style={{ backgroundColor: color }}></div>

          {/* Header Ticket info */}
          <div className="flex justify-between items-center w-full pb-3 border-b border-white/5">
            <div className="text-left">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider block">STUDENT PASS</span>
              <span className="text-xs font-black text-white">Siddharth Sen</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider block">ROLL NO</span>
              <span className="text-xs font-mono font-black text-cyan-400">IIT2023089</span>
            </div>
          </div>

          {/* Glowing QR Code Block */}
          <div className="relative w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg"
            style={{ boxShadow: `0 0 25px ${color}20` }}>
            {/* Custom SVG QR Code */}
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

          {/* Ticket Stats Details */}
          <div className="grid grid-cols-2 gap-4 w-full pt-3 border-t border-white/5 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-500 tracking-wider block">ASSIGNED BUS</span>
              <span className="text-xs font-extrabold text-white" style={{ color: color }}>
                {activeBus.busId}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 tracking-wider block">ROUTE REGISTRY</span>
              <span className="text-xs font-extrabold text-slate-300">
                {activeBus.route.split(" ")[0]}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center font-bold">
          Boarding scans logs will automatically verify parent checkout timelines.
        </p>
      </div>

      {/* COLUMN 2: Voice Command Terminal (Simulated NLP dialogue console) */}
      <div className="flex flex-col gap-4 justify-between h-full min-h-0">
        
        {/* Terminal Header */}
        <div>
          <h4 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Voice & Natural Assistant Terminal</h4>
          <h3 className="text-xs font-black text-cyan-400 mt-0.5">CAMPUSFLOW AI CONSOLE</h3>
        </div>

        {/* Dialogues List */}
        <div className="flex-1 min-h-[220px] overflow-y-auto p-3 rounded-xl glass-panel border border-white/5 flex flex-col gap-3">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === "bot"
            return (
              <div
                key={idx}
                className={`max-w-[85%] p-2.5 rounded-xl text-[11px] font-semibold leading-relaxed transition-all ${
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
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none py-1">
          <button
            onClick={() => handleQuery("Where is Bus 104?")}
            className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wide border border-white/5 bg-white/2 text-slate-400 hover:text-slate-200 hover:bg-white/4 whitespace-nowrap"
          >
            📍 Bus 104?
          </button>
          <button
            onClick={() => handleQuery("Show active alerts")}
            className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wide border border-white/5 bg-white/2 text-slate-400 hover:text-slate-200 hover:bg-white/4 whitespace-nowrap"
          >
            🚨 Active alerts?
          </button>
          <button
            onClick={() => handleQuery("Which bus is fastest?")}
            className="px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wide border border-white/5 bg-white/2 text-slate-400 hover:text-slate-200 hover:bg-white/4 whitespace-nowrap"
          >
            ⚡ Fastest Shuttle?
          </button>
        </div>

        {/* Input box */}
        <div className="flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type your transit query..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuery(inputValue)
            }}
            className="flex-1 glass-input text-xs px-3 py-2.5 rounded-xl font-semibold"
          />
          <button
            onClick={() => handleQuery(inputValue)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black hover:bg-cyan-500/30 active:scale-95 transition-all"
          >
            SEND
          </button>
        </div>

      </div>
    </div>
  )
}
