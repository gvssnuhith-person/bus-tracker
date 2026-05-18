"use client"

import { useEffect, useState } from "react"
import { useBusStore, NotificationLog } from "@/store/busStore"
import { AnimatePresence, motion } from "framer-motion"

export default function NotificationEngine() {
  const { notifications } = useBusStore()
  const [activeToasts, setActiveToasts] = useState<NotificationLog[]>([])

  // Watch for new notifications and add them to active toasts
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotif = notifications[0]
      
      // Prevent duplicate rendering of same alert ID
      setActiveToasts((prev) => {
        const alreadyExists = prev.some((t) => t.id === latestNotif.id)
        if (alreadyExists) return prev

        // Push new alert and limit visible toasts to 4
        const updated = [latestNotif, ...prev].slice(0, 4)

        // Set timer to automatically remove this toast after 4.5 seconds
        setTimeout(() => {
          setActiveToasts((current) => current.filter((t) => t.id !== latestNotif.id))
        }, 4500)

        return updated
      })
    }
  }, [notifications])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-[340px] pointer-events-none select-none">
      <AnimatePresence mode="popLayout">
        {activeToasts.map((toast) => {
          // Color coding based on severity
          const borderStyle =
            toast.severity === "success"
              ? "border-emerald-500/20 bg-emerald-950/90 text-emerald-100 shadow-neon-emerald"
              : toast.severity === "warning"
              ? "border-amber-500/20 bg-amber-950/90 text-amber-100 shadow-neon-amber"
              : toast.severity === "error"
              ? "border-rose-500/20 bg-rose-950/90 text-rose-100 shadow-neon-rose"
              : "border-cyan-500/20 bg-cyan-950/90 text-cyan-100 shadow-neon-cyan"

          const icon =
            toast.severity === "success"
              ? "✅"
              : toast.severity === "warning"
              ? "⚠️"
              : toast.severity === "error"
              ? "🚨"
              : "ℹ️"

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto p-4 rounded-xl border flex gap-3 shadow-lg backdrop-blur-md ${borderStyle}`}
            >
              <div className="text-base shrink-0 select-none">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold tracking-wide leading-relaxed">
                  {toast.message}
                </p>
                <div className="flex justify-between items-center mt-2 text-[9px] font-extrabold opacity-60">
                  <span>{toast.busId || "SYSTEM DISPATCH"}</span>
                  <span className="font-mono">{toast.timestamp}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
