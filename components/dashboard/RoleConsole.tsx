"use client"

import { useBusStore, UserRole } from "@/store/busStore"

export default function RoleConsole() {
  const {
    activeRole,
    setActiveRole,
    voiceEnabled,
    setVoiceEnabled,
    heatmapEnabled,
    setHeatmapEnabled,
    sosTriggered,
    setSosTriggered,
    campusName,
  } = useBusStore()

  const roles: { id: UserRole; label: string; desc: string; icon: string }[] = [
    { id: "admin", label: "Admin Command", desc: "Enterprise Control", icon: "🛡️" },
    { id: "student", label: "Student Hub", desc: "Mobile Tracking & QR", icon: "🎓" },
    { id: "parent", label: "Parent Safety", desc: "Alerts & RFID Logs", icon: "🏡" },
    { id: "driver", label: "Driver Tablet", desc: "NFC Simulator & SOS", icon: "🚍" },
  ]

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between select-none">
      
      {/* Platform Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <span className="text-xl font-bold text-white">C</span>
        </div>
        <div>
          <h1 className="text-sm font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase">
            {campusName}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-wider">
            Smart Transit Ecosystem
          </p>
        </div>
      </div>

      {/* Role Pill Switcher */}
      <div className="flex flex-wrap gap-1.5 glass-panel p-1 rounded-xl border border-white/5 bg-slate-950/40">
        {roles.map((role) => {
          const isActive = activeRole === role.id
          return (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 text-white shadow-inner scale-105"
                  : "border border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/2"
              }`}
            >
              <span className="text-sm">{role.icon}</span>
              <div className="text-left">
                <span className="text-[11px] font-extrabold block tracking-wide leading-none">
                  {role.label}
                </span>
                <span className="text-[8px] font-semibold text-slate-500 block mt-0.5">
                  {role.desc}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Telematics Controls (Voice, Heatmap, SOS indicators) */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        
        {/* Map Heatmap layer Toggle */}
        <button
          onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all flex items-center gap-1.5 ${
            heatmapEnabled
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-white/3 text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          <span>🔥</span>
          <span>Heatmap Overlay</span>
        </button>

        {/* Vocal Alert announcer toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all flex items-center gap-1.5 ${
            voiceEnabled
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse-glow"
              : "bg-white/3 text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          <span>🔊</span>
          <span>Voice Alerts</span>
        </button>

        {/* Global SOS Flashing indicator status */}
        {sosTriggered && (
          <button
            onClick={() => setSosTriggered(false)}
            className="px-3 py-2 rounded-xl text-[10px] font-extrabold tracking-widest uppercase bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse cursor-pointer"
          >
            🚨 ACTIVE EMERGENCY
          </button>
        )}
      </div>

    </div>
  )
}
