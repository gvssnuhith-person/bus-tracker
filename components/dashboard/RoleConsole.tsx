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
    theme,
    setTheme,
    searchQuery,
    setSearchQuery,
    loggedInUser,
    logout,
  } = useBusStore()

  const roles: { id: UserRole; label: string; desc: string; icon: string }[] = [
    { id: "admin", label: "Admin Command", desc: "Live Fleet HQ", icon: "🛡️" },
    { id: "student", label: "Student Hub", desc: "Digital QR Ticket", icon: "🎓" },
    { id: "parent", label: "Parent Safety", desc: "RFID Check-ins", icon: "🏡" },
    { id: "driver", label: "Driver Console", desc: "SOS Checklist", icon: "🚍" },
    { id: "manager", label: "Transport Head", desc: "Campuses & Reports", icon: "💼" },
    { id: "security", label: "Security Guard", desc: "Surveillance CCTV", icon: "🚨" },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className={`w-full glass-panel rounded-2xl p-4 border flex flex-col xl:flex-row gap-4 items-center justify-between select-none ${
      theme === "light" ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-slate-900/40 border-white/5 text-slate-100"
    }`}>
      
      {/* 1. Dynamic Platform Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <span className="text-lg font-bold text-white">C</span>
        </div>
        <div>
          <h1 className="text-xs font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase leading-tight">
            {campusName}
          </h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
            Smart Transit Ecosystem
          </p>
        </div>
      </div>

      {/* 2. Unified Smart Search System */}
      <div className="w-full max-w-xs relative shrink-0">
        <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        <input
          type="text"
          placeholder="Search buses, drivers, routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-[10px] font-bold outline-none border transition-all ${
            theme === "light"
              ? "bg-slate-100 border-slate-200 text-slate-900 focus:border-cyan-400"
              : "bg-slate-950 border-white/5 text-slate-100 focus:border-cyan-500/40"
          }`}
        />
      </div>

      {/* 3. Multi-Role Swapper Tabs */}
      <div className={`flex flex-wrap gap-1 p-1 rounded-xl border ${
        theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-950/40 border-white/5"
      }`}>
        {roles.map((role) => {
          const isActive = activeRole === role.id
          return (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-400/20 text-cyan-400 shadow-inner scale-[1.01]"
                  : "border border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="text-xs">{role.icon}</span>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] font-black block tracking-wider leading-none uppercase">
                  {role.label.split(" ")[0]}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* 4. Controls (Theme, Voice, SOS, Profile & Logout) */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
            theme === "light" ? "border-slate-200 bg-slate-100 text-slate-700" : "border-white/5 bg-slate-950/40 text-slate-300"
          }`}
          title="Toggle Light/Dark Theme"
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        {/* Heatmap Overlay */}
        <button
          onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider uppercase border transition-all ${
            heatmapEnabled
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          🔥 Heatmap
        </button>

        {/* SOS Warning Indicator */}
        {sosTriggered && (
          <button
            onClick={() => setSosTriggered(false)}
            className="px-2.5 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase bg-rose-500/25 border border-rose-500/40 text-rose-400 animate-pulse cursor-pointer"
          >
            🚨 SOS ACTIVE
          </button>
        )}

        {/* User Session profile + Logout */}
        {loggedInUser && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-2">
            <div className="text-right hidden md:block">
              <span className="text-[10px] font-black text-slate-400 block uppercase leading-none">{loggedInUser.name.split(" ")[0]}</span>
              <span className="text-[8px] font-bold text-slate-500 block mt-0.5 tracking-wider uppercase">{loggedInUser.role}</span>
            </div>
            <button
              onClick={logout}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase active:scale-95 transition-all"
            >
              Logout
            </button>
          </div>
        )}

      </div>

    </div>
  )
}
