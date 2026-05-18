"use client"

import { useState } from "react"
import { useBusStore, Campus } from "@/store/busStore"

export default function TransportHeadPanel() {
  const {
    campuses,
    addCampus,
    removeCampus,
    routes,
    buses,
    attendanceLogs,
    addNotification,
  } = useBusStore()

  // Campus Add fields
  const [cName, setCName] = useState("")
  const [cAddress, setCAddress] = useState("")
  const [cPhone, setCPhone] = useState("")
  const [cHead, setCHead] = useState("")
  const [cLogo, setCLogo] = useState("🏫")
  const [cLat, setCLat] = useState("20.5937")
  const [cLng, setCLng] = useState("78.9629")

  // PDF report mock generator states
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportType, setReportType] = useState<"attendance" | "fleet" | "fuel">("attendance")

  const handleCreateCampus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cName.trim()) return

    const payload: Campus = {
      id: `campus-${Date.now()}`,
      name: cName.trim(),
      address: cAddress.trim() || "Campus Boulevard Road, Hyd",
      phone: cPhone.trim() || "+91 40 2300 0000",
      transportHead: cHead.trim() || "Asst. Suptd. Kumar",
      logo: cLogo,
      lat: parseFloat(cLat) || 20.5937,
      lng: parseFloat(cLng) || 78.9629,
    }

    addCampus(payload)
    addNotification(`Transport Head: New Campus Depot '${payload.name}' deployed to coordinates [${payload.lat}, ${payload.lng}].`, "success")

    // Reset fields
    setCName("")
    setCAddress("")
    setCPhone("")
    setCHead("")
    setCLat("20.5937")
    setCLng("78.9629")
  }

  const triggerMockDownload = () => {
    setReportGenerated(true)
    setTimeout(() => {
      alert(`[CampusFlow AI] Report download initiated successfully in PDF/Excel format!`)
      setReportGenerated(false)
    }, 2000)
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 select-none p-1">
      
      {/* LEFT COLUMN: Campus CRUD Registry & Timings Scheduler (7 columns) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* 1. Manage Campuses CRUD */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <span className="text-[9px] font-black text-cyan-400 tracking-widest block uppercase">CAMPUS DIRECTORY MANAGER</span>
              <h3 className="text-sm font-black text-white uppercase mt-0.5">Manage Registered Campus Depots</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-black">{campuses.length} DEPOTS</span>
          </div>

          {/* List Depots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {campuses.map((c) => (
              <div key={c.id} className="glass-panel p-3.5 rounded-xl border border-white/5 bg-slate-950/40 relative flex gap-3 group">
                <span className="text-2xl">{c.logo}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-slate-200 truncate">{c.name}</h4>
                  <p className="text-[8px] text-slate-500 font-semibold truncate mt-1">📍 {c.address}</p>
                  <p className="text-[8px] text-slate-500 font-semibold mt-0.5">📞 {c.phone}</p>
                  <p className="text-[8px] text-cyan-400/80 font-bold mt-1">Coord: [{c.lat.toFixed(3)}, {c.lng.toFixed(3)}]</p>
                </div>
                <button
                  onClick={() => {
                    removeCampus(c.id)
                    addNotification(`Transport Head: Campus '${c.name}' removed from directory logs.`, "warning")
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition-all font-mono text-xs opacity-0 group-hover:opacity-100"
                  title="Remove Campus"
                  disabled={campuses.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add Campus Form */}
          <form onSubmit={handleCreateCampus} className="border-t border-white/5 pt-4 space-y-3">
            <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase block">
              + Register New Campus Depot
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Campus Name</label>
                <input
                  type="text"
                  placeholder="E.g. Hitech Hub Campus"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Transport Head Director</label>
                <input
                  type="text"
                  placeholder="E.g. Ramesh Kumar"
                  value={cHead}
                  onChange={(e) => setCHead(e.target.value)}
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Address Location</label>
                <input
                  type="text"
                  placeholder="E.g. Sector-V, DLF Lane, Hyd"
                  value={cAddress}
                  onChange={(e) => setCAddress(e.target.value)}
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Depot Phone</label>
                <input
                  type="tel"
                  placeholder="+91 40 2300"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Deploy Latitude</label>
                <input
                  type="text"
                  placeholder="E.g. 28.692"
                  value={cLat}
                  onChange={(e) => setCLat(e.target.value)}
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Deploy Longitude</label>
                <input
                  type="text"
                  placeholder="E.g. 77.214"
                  value={cLng}
                  onChange={(e) => setCLng(e.target.value)}
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                {["🏫", "🕌", "🏭", "🏢"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setCLogo(emoji)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-all ${
                      cLogo === emoji ? "border-cyan-400 bg-cyan-500/10" : "border-white/5 bg-slate-900/40"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg active:scale-95 transition-all"
              >
                Register Campus
              </button>
            </div>
          </form>
        </div>

        {/* 2. Route Timing Schedules (Morning + Evening) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div>
            <span className="text-[9px] font-black text-purple-400 tracking-widest block uppercase">LINE MASTER SCHEDULES</span>
            <h3 className="text-sm font-black text-white uppercase mt-0.5">Route Timing Coordinations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Morning Shift */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 space-y-3">
              <span className="text-[9px] font-black text-cyan-400 tracking-wider block uppercase">🌅 Morning Shift (Boarding)</span>
              <div className="space-y-2 text-[10px] font-bold text-slate-300">
                <div className="flex justify-between border-b border-white/3 pb-1">
                  <span>Hitech City Express</span>
                  <span className="text-cyan-400">07:45 AM Departure</span>
                </div>
                <div className="flex justify-between border-b border-white/3 pb-1">
                  <span>Charminar Heritage</span>
                  <span className="text-cyan-400">08:15 AM Departure</span>
                </div>
                <div className="flex justify-between">
                  <span>ORR Campus Shuttle</span>
                  <span className="text-cyan-400">07:30 AM Departure</span>
                </div>
              </div>
            </div>

            {/* Evening Shift */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 space-y-3">
              <span className="text-[9px] font-black text-purple-400 tracking-wider block uppercase">🌇 Evening Shift (Drop-off)</span>
              <div className="space-y-2 text-[10px] font-bold text-slate-300">
                <div className="flex justify-between border-b border-white/3 pb-1">
                  <span>Hitech City Express</span>
                  <span className="text-purple-400">04:30 PM Departure</span>
                </div>
                <div className="flex justify-between border-b border-white/3 pb-1">
                  <span>Charminar Heritage</span>
                  <span className="text-purple-400">05:00 PM Departure</span>
                </div>
                <div className="flex justify-between">
                  <span>ORR Campus Shuttle</span>
                  <span className="text-purple-400">04:15 PM Departure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Printable Report Exporter & Approvals Desk (5 columns) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* 1. PDF / Excel Report Exporter */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div>
            <span className="text-[9px] font-black text-emerald-400 tracking-widest block uppercase">REPORT EXPORTER HUB</span>
            <h3 className="text-sm font-black text-white uppercase mt-0.5">Generate Printable Audit Sheets</h3>
          </div>

          <div className="space-y-2.5">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Choose Report Type</span>
            <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-white/5">
              {(["attendance", "fleet", "fuel"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setReportType(type)}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                    reportType === type ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Roster */}
          <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Print Preview Sheet</span>
            
            {reportType === "attendance" ? (
              /* Attendance Roster */
              <div className="max-h-[120px] overflow-y-auto space-y-1.5 no-scrollbar text-[9px] font-bold">
                {attendanceLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/3">
                    <span>{log.studentName} ({log.rollNumber})</span>
                    <span className="text-emerald-400 font-mono">{log.timestamp} • Boarded</span>
                  </div>
                ))}
              </div>
            ) : reportType === "fleet" ? (
              /* Fleet List */
              <div className="max-h-[120px] overflow-y-auto space-y-1.5 no-scrollbar text-[9px] font-bold">
                {buses.map((bus) => (
                  <div key={bus.busId} className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/3">
                    <span>{bus.busId} ({bus.driver.name})</span>
                    <span className="text-cyan-400 uppercase font-mono">{bus.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Fuel EV Roster */
              <div className="max-h-[120px] overflow-y-auto space-y-1.5 no-scrollbar text-[9px] font-bold">
                {buses.map((bus) => (
                  <div key={bus.busId} className="flex justify-between items-center text-slate-400 pb-1 border-b border-white/3">
                    <span>{bus.busId} (EV Shuttle)</span>
                    <span className="text-amber-400 font-mono">{bus.evBatteryCharge}% charge</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={triggerMockDownload}
            disabled={reportGenerated}
            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {reportGenerated ? (
              <>
                <span className="animate-spin">🔄</span>
                <span>Compiling printable PDF...</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Compile & Print pdf report</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Manager Approval Checksheets */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/10 space-y-4">
          <div>
            <span className="text-[9px] font-black text-amber-400 tracking-widest block uppercase">LINE REQUEST APPROVALS</span>
            <h3 className="text-sm font-black text-white uppercase mt-0.5">Manager Approvals Panel</h3>
          </div>
          
          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-white/5 bg-slate-950/40 flex justify-between items-center text-[10px] font-bold">
              <div>
                <span className="text-slate-200 block">Deploy spare BUS-112 to Hitech express?</span>
                <span className="text-[8px] text-slate-500 mt-1 block">Requested by Suptd. Yadav</span>
              </div>
              <button
                onClick={() => addNotification("Approvals: Deploy spare BUS-112 request approved.", "success")}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[9px] font-black uppercase active:scale-95 transition-all"
              >
                Approve
              </button>
            </div>

            <div className="p-3 rounded-xl border border-white/5 bg-slate-950/40 flex justify-between items-center text-[10px] font-bold">
              <div>
                <span className="text-slate-200 block">Monsoon speed dampener reduction (15%)?</span>
                <span className="text-[8px] text-slate-500 mt-1 block">Automatic AI Weather Warning</span>
              </div>
              <button
                onClick={() => addNotification("Approvals: Weather advisory cruise reduction activated.", "success")}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-black uppercase active:scale-95 transition-all"
              >
                Activate
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
