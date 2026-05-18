"use client"

import { useState } from "react"
import { useBusStore } from "@/store/busStore"
import { motion, AnimatePresence } from "framer-motion"

export default function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const { buses, notifications, attendanceLogs, addNotification } = useBusStore()
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Dispatcher AI online. Ask me about active fleet velocities, passenger totals, safety incidents, or route delays." },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return

    const newMessages = [...messages, { sender: "user" as const, text: queryText }]
    setMessages(newMessages)
    setInputValue("")

    setTimeout(() => {
      const lower = queryText.toLowerCase()
      let reply = ""

      if (lower.includes("commuters") || lower.includes("passenger") || lower.includes("occupancy")) {
        const total = buses.reduce((acc, curr) => acc + curr.passengers, 0)
        reply = `Total active commuters checked in across the campus fleet is currently ${total} students.`
      } else if (lower.includes("alert") || lower.includes("safety") || lower.includes("warning")) {
        const errors = notifications.filter((n) => n.severity === "error" || n.severity === "warning")
        if (errors.length > 0) {
          reply = `Active safety indicators flag ${errors.length} alert(s). Review logs immediately: "${errors[0].message}"`
        } else {
          reply = "All safety protocols report green. Active speed thresholds, NFC boarding check-ins, and routing snappings are nominal."
        }
      } else if (lower.includes("delay") || lower.includes("late") || lower.includes("traffic")) {
        const delayed = buses.filter((b) => b.status !== "on-time")
        if (delayed.length > 0) {
          reply = `Active delays detected on ${delayed.length} vehicle(s): ${delayed.map((b) => `${b.busId} (${b.status})`).join(", ")}.`
        } else {
          reply = "All active campus shuttles are currently running precisely en-route and on-time."
        }
      } else if (lower.includes("speed") || lower.includes("velocity") || lower.includes("fastest")) {
        const avg = Math.round(buses.reduce((acc, curr) => acc + curr.speed, 0) / buses.length)
        reply = `Average fleet cruising velocity is ${avg} km/h. Fastest active vehicle is B-500 en-route at 68 km/h.`
      } else if (lower.includes("drill") || lower.includes("simulate incident")) {
        addNotification("AI Drill Dispatch: Simulated emergency alert drill triggered.", "warning")
        reply = "Campus AI Drill dispatched. Flashing indicators and telemetry alert drills triggered successfully."
      } else {
        reply = "I parsed your query. Try asking: 'Show active alerts', 'How many passengers onboard?', or 'What is average fleet speed?'"
      }

      setMessages((prev) => [...prev, { sender: "bot" as const, text: reply }])

      // Vocal text-to-speech
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const { voiceEnabled } = useBusStore.getState()
        if (voiceEnabled) {
          const utterance = new SpeechSynthesisUtterance(reply.slice(0, 120))
          window.speechSynthesis.speak(utterance)
        }
      }
    }, 700)
  }

  return (
    <div className="fixed bottom-6 left-6 z-[999] select-none">
      
      {/* Floating Toggle Bubble Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 border border-cyan-400/20 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer relative"
        style={{ boxShadow: "0 0 20px rgba(6,182,212,0.25)" }}
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-xl">🤖</span>
        )}
        
        {/* Active notification indicator */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border border-slate-950 flex items-center justify-center text-[7px] font-black text-white">
            !
          </div>
        )}
      </button>

      {/* Terminal Slide Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="absolute bottom-16 left-0 w-[300px] h-[360px] glass-panel border border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-2xl backdrop-blur-md"
          >
            {/* Panel Header */}
            <div className="pb-2 border-b border-white/5 flex justify-between items-center">
              <div>
                <h4 className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Copilot Assistant</h4>
                <h3 className="text-xs font-black text-white mt-0.5">TRANSIT COPILOT AI</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto my-2 space-y-3 p-1 flex flex-col no-scrollbar">
              {messages.map((msg, idx) => {
                const isBot = msg.sender === "bot"
                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-2 rounded-xl text-[10px] font-semibold leading-relaxed ${
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

            {/* Suggestions */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar shrink-0 py-1 border-t border-white/5">
              <button
                onClick={() => handleQuery("Show delayed buses")}
                className="px-2 py-0.5 rounded bg-white/2 border border-white/3 text-[8px] font-bold text-slate-400 hover:text-slate-200 whitespace-nowrap"
              >
                📍 Show Delays
              </button>
              <button
                onClick={() => handleQuery("What is average fleet speed?")}
                className="px-2 py-0.5 rounded bg-white/2 border border-white/3 text-[8px] font-bold text-slate-400 hover:text-slate-200 whitespace-nowrap"
              >
                ⚡ Avg Speed
              </button>
              <button
                onClick={() => handleQuery("How many passengers onboard?")}
                className="px-2 py-0.5 rounded bg-white/2 border border-white/3 text-[8px] font-bold text-slate-400 hover:text-slate-200 whitespace-nowrap"
              >
                👥 Commuters
              </button>
            </div>

            {/* Input Form */}
            <div className="flex gap-2 mt-2 shrink-0">
              <input
                type="text"
                placeholder="Ask Campus AI..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleQuery(inputValue)
                }}
                className="flex-1 glass-input text-[10px] px-3 py-2 rounded-lg font-semibold"
              />
              <button
                onClick={() => handleQuery(inputValue)}
                className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-black hover:bg-cyan-500/30 active:scale-95 transition-all"
              >
                ASK
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
