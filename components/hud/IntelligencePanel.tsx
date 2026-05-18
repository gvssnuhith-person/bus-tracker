"use client"

import { useState } from "react"
import { useBusStore, Bus, Route, Campus, StudentAttendance } from "@/store/busStore"

export default function IntelligencePanel() {
  const {
    buses,
    routes,
    selectedBusId,
    setSelectedBusId,
    campusName,
    setCampusName,
    campuses,
    addCampus,
    removeCampus,
    updateCampus,
    addBus,
    removeBus,
    updateBus,
    addRoute,
    removeRoute,
    updateRoute,
    addAttendanceLog,
    removeAttendanceLog,
    updateAttendanceLog,
    attendanceLogs,
    addNotification,
  } = useBusStore()

  // Tab state
  const [activeTab, setActiveTab] = useState<"telemetry" | "routes" | "campus" | "attendance">("telemetry")

  // Bus Add form states
  const [newBusId, setNewBusId] = useState("")
  const [newBusRouteId, setNewBusRouteId] = useState(routes[0]?.id || "route-hitech")
  const [newBusDriverName, setNewBusDriverName] = useState("")

  // Bus Edit states
  const [editingBusId, setEditingBusId] = useState<string | null>(null)
  const [editBusDriverName, setEditBusDriverName] = useState("")
  const [editBusSpeed, setEditBusSpeed] = useState("")
  const [editBusEvCharge, setEditBusEvCharge] = useState("")
  const [editBusStatus, setEditBusStatus] = useState<Bus["status"]>("on-time")
  const [editBusPassengers, setEditBusPassengers] = useState("")

  // Route Add form states
  const [newRouteId, setNewRouteId] = useState("")
  const [newRouteName, setNewRouteName] = useState("")
  const [newRouteColor, setNewRouteColor] = useState("#00f0ff")

  // Route Edit states
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null)
  const [editRouteName, setEditRouteName] = useState("")
  const [editRouteColor, setEditRouteColor] = useState("")

  // Campus Add states
  const [newCampusName, setNewCampusName] = useState("")
  const [newCampusAddress, setNewCampusAddress] = useState("")
  const [newCampusPhone, setNewCampusPhone] = useState("")
  const [newCampusHead, setNewCampusHead] = useState("")
  const [newCampusLogo, setNewCampusLogo] = useState("🏫")
  const [newCampusLat, setNewCampusLat] = useState("20.5937")
  const [newCampusLng, setNewCampusLng] = useState("78.9629")

  // Campus Edit states
  const [editingCampusId, setEditingCampusId] = useState<string | null>(null)
  const [editCampusName, setEditCampusName] = useState("")
  const [editCampusAddress, setEditCampusAddress] = useState("")
  const [editCampusPhone, setEditCampusPhone] = useState("")
  const [editCampusHead, setEditCampusHead] = useState("")
  const [editCampusLogo, setEditCampusLogo] = useState("🏫")
  const [editCampusLat, setEditCampusLat] = useState("")
  const [editCampusLng, setEditCampusLng] = useState("")

  // Attendance Add states
  const [newStudentName, setNewStudentName] = useState("")
  const [newRollNumber, setNewRollNumber] = useState("")
  const [newStudentBusId, setNewStudentBusId] = useState("BUS-104")
  const [newStopName, setNewStopName] = useState("Ameerpet Station")
  const [newLogType, setNewLogType] = useState<"RFID Tap" | "QR Scan" | "NFC Detect">("RFID Tap")

  // Attendance Edit states
  const [editingLogId, setEditingLogId] = useState<string | null>(null)
  const [editStudentName, setEditStudentName] = useState("")
  const [editRollNumber, setEditRollNumber] = useState("")
  const [editStudentBusId, setEditStudentBusId] = useState("")
  const [editStopName, setEditStopName] = useState("")
  const [editLogType, setEditLogType] = useState<"RFID Tap" | "QR Scan" | "NFC Detect">("RFID Tap")

  const selectedBus = buses.find((b) => b.busId === selectedBusId) || null
  const route = selectedBus ? routes.find((r) => r.id === selectedBus.routeId) : null
  const color = route ? route.color : "#00f0ff"

  // Heading bearing translation
  const getDirection = (heading: number) => {
    if (heading >= 337.5 || heading < 22.5) return "N"
    if (heading >= 22.5 && heading < 67.5) return "NE"
    if (heading >= 67.5 && heading < 112.5) return "E"
    if (heading >= 112.5 && heading < 157.5) return "SE"
    if (heading >= 157.5 && heading < 202.5) return "S"
    if (heading >= 202.5 && heading < 247.5) return "SW"
    if (heading >= 247.5 && heading < 292.5) return "W"
    return "NW"
  }

  // Handle bus addition
  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBusId.trim()) return

    const selectedRoute = routes.find((r) => r.id === newBusRouteId)
    if (!selectedRoute) return

    const startCoords = selectedRoute.path[0]

    const busPayload: Bus = {
      busId: newBusId.toUpperCase().trim(),
      routeId: newBusRouteId,
      route: `${selectedRoute.name} (Line ${selectedRoute.name.charAt(0)})`,
      lat: startCoords[0],
      lng: startCoords[1],
      heading: 90,
      speed: 35,
      capacity: 50,
      passengers: 0,
      fuelLevel: 100,
      status: "on-time",
      nextStop: selectedRoute.stops[0]?.name || "Terminal",
      etaMinutes: 2,
      driver: {
        name: newBusDriverName.trim() || "Unassigned Pilot",
        avatar: "👨‍✈️",
        rating: 5.0,
        phone: "+91 99999 88888",
      },
      currentPathIndex: 0,
      evBatteryCharge: 100,
      mileage: 7.5,
      tirePressure: "Nominal (34 PSI)",
      engineAlerts: "No active faults",
      cctvActive: true,
      weatherWarning: "Nominal en-route",
    }

    addBus(busPayload)
    addNotification(`Admin Config: Bus ${busPayload.busId} deployed to ${selectedRoute.name}.`, "success", busPayload.busId)

    // Reset fields
    setNewBusId("")
    setNewBusDriverName("")
  }

  // Handle bus edits
  const handleEditBusSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBusId) return

    const parsedSpeed = parseInt(editBusSpeed) || 0
    const parsedEv = Math.min(100, Math.max(0, parseInt(editBusEvCharge) || 100))
    const parsedPass = parseInt(editBusPassengers) || 0

    updateBus(editingBusId, {
      speed: parsedSpeed,
      evBatteryCharge: parsedEv,
      fuelLevel: parsedEv,
      status: editBusStatus,
      passengers: parsedPass,
      driver: {
        name: editBusDriverName.trim() || "Pilot",
        avatar: "👨‍✈️",
        rating: 4.8,
        phone: "+91 99999 88888",
      }
    })

    addNotification(`Admin Config: Shuttle ${editingBusId} parameters successfully modified.`, "success", editingBusId)
    setEditingBusId(null)
  }

  // Handle route addition
  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRouteId.trim() || !newRouteName.trim()) return

    const routePayload: Route = {
      id: newRouteId.toLowerCase().replace(/\s+/g, "-").trim(),
      name: newRouteName.trim(),
      color: newRouteColor,
      stops: [
        { name: `${newRouteName} Start`, lat: 17.41, lng: 78.43 },
        { name: `${newRouteName} Depot`, lat: 17.44, lng: 78.46 },
      ],
      path: [
        [17.41, 78.43],
        [17.425, 78.445],
        [17.44, 78.46],
      ],
    }

    addRoute(routePayload)
    addNotification(`Admin Config: Route '${routePayload.name}' mapped and visual vector snap uploaded.`, "success")

    // Reset fields
    setNewRouteId("")
    setNewRouteName("")
  }

  // Handle route edits
  const handleEditRouteSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRouteId) return

    updateRoute(editingRouteId, {
      name: editRouteName.trim(),
      color: editRouteColor,
    })

    addNotification(`Admin Config: Route '${editRouteName}' config updated successfully.`, "success")
    setEditingRouteId(null)
  }

  // Handle campus addition
  const handleAddCampus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCampusName.trim()) return

    const campusPayload: Campus = {
      id: `campus-${Date.now()}`,
      name: newCampusName.trim(),
      address: newCampusAddress.trim() || "Depot Boulevard Rd",
      phone: newCampusPhone.trim() || "+91 40 2300",
      transportHead: newCampusHead.trim() || "Superintendent Rao",
      logo: newCampusLogo,
      lat: parseFloat(newCampusLat) || 20.5937,
      lng: parseFloat(newCampusLng) || 78.9629,
    }

    addCampus(campusPayload)
    addNotification(`Admin Config: New Depot '${campusPayload.name}' deployed to coords [${campusPayload.lat}, ${campusPayload.lng}].`, "success")

    // Reset
    setNewCampusName("")
    setNewCampusAddress("")
    setNewCampusPhone("")
    setNewCampusHead("")
    setNewCampusLat("20.5937")
    setNewCampusLng("78.9629")
  }

  // Handle campus edits
  const handleEditCampusSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCampusId) return

    updateCampus(editingCampusId, {
      name: editCampusName.trim(),
      address: editCampusAddress.trim(),
      phone: editCampusPhone.trim(),
      transportHead: editCampusHead.trim(),
      logo: editCampusLogo,
      lat: parseFloat(editCampusLat) || 20.5937,
      lng: parseFloat(editCampusLng) || 78.9629,
    })

    addNotification(`Admin Config: Campus '${editCampusName}' depot logs updated successfully.`, "success")
    setEditingCampusId(null)
  }

  // Handle attendance addition
  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStudentName.trim() || !newRollNumber.trim()) return

    addAttendanceLog({
      studentName: newStudentName.trim(),
      rollNumber: newRollNumber.trim().toUpperCase(),
      busId: newStudentBusId,
      stopName: newStopName,
      type: newLogType,
    })

    addNotification(`Admin Config: NFC Smart Check-in logged for ${newStudentName} (${newRollNumber})`, "success", newStudentBusId)

    // Reset
    setNewStudentName("")
    setNewRollNumber("")
  }

  // Handle attendance edits
  const handleEditAttendanceSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLogId) return

    updateAttendanceLog(editingLogId, {
      studentName: editStudentName.trim(),
      rollNumber: editRollNumber.trim().toUpperCase(),
      busId: editStudentBusId,
      stopName: editStopName,
      type: editLogType,
    })

    addNotification(`Admin Config: Smart RFID Log entry corrected.`, "success")
    setEditingLogId(null)
  }

  return (
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-md rounded-2xl p-4 min-h-0 border border-white/5 select-none">
      
      {/* 4-Tab Advanced Admin CRUD Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black border border-white/5 mb-4 shrink-0">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 text-center ${
            activeTab === "telemetry"
              ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shadow-inner"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🚌 Buses
        </button>
        <button
          onClick={() => setActiveTab("routes")}
          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 text-center ${
            activeTab === "routes"
              ? "bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-inner"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🛣️ Routes
        </button>
        <button
          onClick={() => setActiveTab("campus")}
          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 text-center ${
            activeTab === "campus"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-inner"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🏫 Depots
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 text-center ${
            activeTab === "attendance"
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-inner"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          📝 RFID
        </button>
      </div>

      {/* DYNAMIC SCROLL CONTAINER */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar space-y-4">

        {/* ==================== TAB 1: BUSES & LIVE TELEMETRY ==================== */}
        {activeTab === "telemetry" && (
          <div className="space-y-4">
            
            {/* Live telemetry of selected bus */}
            {selectedBus ? (
              <div className="p-3.5 rounded-xl border border-white/5 bg-black/40 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div>
                    <h4 className="text-[8px] font-black text-cyan-400 tracking-wider uppercase">Live Telematics Feed</h4>
                    <h3 className="text-xs font-black text-slate-100">{selectedBus.busId}</h3>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 font-mono">
                    {selectedBus.driver.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-white/2 border border-white/3 text-center">
                    <span className="text-[7px] text-slate-500 font-bold block uppercase">Speed</span>
                    <span className="text-xs font-black text-cyan-400 font-mono mt-1 block">{selectedBus.speed} km/h</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/2 border border-white/3 text-center">
                    <span className="text-[7px] text-slate-500 font-bold block uppercase">Battery</span>
                    <span className="text-xs font-black text-emerald-400 font-mono mt-1 block">{selectedBus.evBatteryCharge}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/2 border border-white/3 text-center">
                    <span className="text-[7px] text-slate-500 font-bold block uppercase">Status</span>
                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-tight mt-1.5 block truncate">
                      {selectedBus.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-[10px] font-bold text-slate-500">
                Select a shuttle in the sidebar to review live feeds
              </div>
            )}

            {/* List and CRUD actions */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase block">
                Active Fleet List
              </span>

              {editingBusId ? (
                /* Edit Bus Subform */
                <form onSubmit={handleEditBusSave} className="p-3.5 rounded-xl border border-cyan-400/20 bg-cyan-950/10 space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[9px] font-black text-cyan-400 uppercase">✏️ Edit Parameters: {editingBusId}</span>
                    <button type="button" onClick={() => setEditingBusId(null)} className="text-[9px] font-bold text-slate-400 hover:text-slate-200">
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Driver Name</label>
                      <input
                        type="text"
                        value={editBusDriverName}
                        onChange={(e) => setEditBusDriverName(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Velocity (km/h)</label>
                      <input
                        type="number"
                        value={editBusSpeed}
                        onChange={(e) => setEditBusSpeed(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">EV Charge %</label>
                      <input
                        type="number"
                        value={editBusEvCharge}
                        onChange={(e) => setEditBusEvCharge(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Passengers</label>
                      <input
                        type="number"
                        value={editBusPassengers}
                        onChange={(e) => setEditBusPassengers(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Status</label>
                      <select
                        value={editBusStatus}
                        onChange={(e) => setEditBusStatus(e.target.value as any)}
                        className="w-full glass-input text-[9px] px-1.5 py-1.5 rounded-md font-bold bg-slate-950"
                      >
                        <option value="on-time">on-time</option>
                        <option value="heavy-traffic">traffic</option>
                        <option value="delayed">delayed</option>
                        <option value="maintenance">maintenance</option>
                        <option value="offline">offline</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-1.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[9px] font-black uppercase hover:bg-cyan-500/30 active:scale-95 transition-all">
                    Commit Changes
                  </button>
                </form>
              ) : (
                /* Regular List view */
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5 no-scrollbar">
                  {buses.map((bus) => (
                    <div key={bus.busId} className="flex justify-between items-center p-2 rounded-lg border border-white/5 bg-black/40 text-[10px] font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-cyan-400 font-bold font-mono">{bus.busId}</span>
                        <span className="text-[8px] text-slate-500 truncate max-w-[90px]">{bus.driver.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingBusId(bus.busId)
                            setEditBusDriverName(bus.driver.name)
                            setEditBusSpeed(bus.speed.toString())
                            setEditBusEvCharge(bus.evBatteryCharge.toString())
                            setEditBusStatus(bus.status)
                            setEditBusPassengers(bus.passengers.toString())
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase hover:bg-cyan-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            removeBus(bus.busId)
                            if (selectedBusId === bus.busId) setSelectedBusId(null)
                            addNotification(`Admin Config: Bus ${bus.busId} decommissioned from fleet.`, "warning")
                          }}
                          className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 font-mono text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deploy New Bus Form */}
            <form onSubmit={handleAddBus} className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                + Deploy New Shuttle
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Shuttle ID (e.g. BUS-880)"
                  value={newBusId}
                  onChange={(e) => setNewBusId(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Driver Full Name"
                  value={newBusDriverName}
                  onChange={(e) => setNewBusDriverName(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newBusRouteId}
                  onChange={(e) => setNewBusRouteId(e.target.value)}
                  className="flex-1 glass-input text-[9px] px-2 py-1.5 rounded-lg bg-slate-900 font-bold border border-white/5 outline-none"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200">
                      {r.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[9px] font-black uppercase hover:bg-cyan-500/30 active:scale-95 transition-all"
                >
                  Deploy
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ==================== TAB 2: ROUTES & LINES ==================== */}
        {activeTab === "routes" && (
          <div className="space-y-4">
            
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase block">
                Campus Line Directory
              </span>

              {editingRouteId ? (
                /* Edit Route Subform */
                <form onSubmit={handleEditRouteSave} className="p-3.5 rounded-xl border border-purple-400/20 bg-purple-950/10 space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[9px] font-black text-purple-400 uppercase">✏️ Edit Route: {editingRouteId}</span>
                    <button type="button" onClick={() => setEditingRouteId(null)} className="text-[9px] font-bold text-slate-400 hover:text-slate-200">
                      Cancel
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Route Line Name</label>
                      <input
                        type="text"
                        value={editRouteName}
                        onChange={(e) => setEditRouteName(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Visual Route Theme Color</label>
                      <select
                        value={editRouteColor}
                        onChange={(e) => setEditRouteColor(e.target.value)}
                        className="w-full glass-input text-[9px] px-1.5 py-1.5 rounded-md font-bold bg-slate-950"
                      >
                        <option value="#00f0ff">Cyan Vector</option>
                        <option value="#bd34fe">Purple Vector</option>
                        <option value="#10b981">Emerald Vector</option>
                        <option value="#f59e0b">Amber Vector</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-1.5 rounded bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-black uppercase hover:bg-purple-500/30 active:scale-95 transition-all">
                    Save Route Configuration
                  </button>
                </form>
              ) : (
                /* Route List view */
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-0.5 no-scrollbar">
                  {routes.map((r) => (
                    <div key={r.id} className="flex justify-between items-center p-2 rounded-lg border border-white/5 bg-black/40 text-[10px] font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                        <span className="text-[9px] text-slate-200 truncate max-w-[140px]">{r.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingRouteId(r.id)
                            setEditRouteName(r.name)
                            setEditRouteColor(r.color)
                          }}
                          className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black uppercase hover:bg-purple-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            removeRoute(r.id)
                            addNotification(`Admin Config: Route '${r.name}' and active snapping vectors decommissioned.`, "warning")
                          }}
                          className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 font-mono text-[10px]"
                          disabled={routes.length <= 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map New Line Form */}
            <form onSubmit={handleAddRoute} className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                + Map New Campus Line
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Route Code (e.g. route-east)"
                  value={newRouteId}
                  onChange={(e) => setNewRouteId(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Line Display Name"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newRouteColor}
                  onChange={(e) => setNewRouteColor(e.target.value)}
                  className="flex-1 glass-input text-[9px] px-2 py-1.5 rounded-lg bg-slate-900 font-bold border border-white/5 outline-none"
                >
                  <option value="#00f0ff" className="bg-slate-950 text-cyan-300">Cyan Express</option>
                  <option value="#bd34fe" className="bg-slate-950 text-purple-300">Purple Line</option>
                  <option value="#10b981" className="bg-slate-950 text-emerald-300">Emerald Commuter</option>
                  <option value="#f59e0b" className="bg-slate-950 text-amber-300">Amber Local</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-black uppercase hover:bg-purple-500/30 active:scale-95 transition-all"
                >
                  Create
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ==================== TAB 3: India Campus Depots ==================== */}
        {activeTab === "campus" && (
          <div className="space-y-4">
            
            {/* Campus Registry settings (Global Name Changer) */}
            <div className="p-3 rounded-xl border border-white/5 bg-slate-950/20">
              <span className="text-[9px] font-black text-slate-500 tracking-widest block uppercase mb-2">
                Global Header Campus Title
              </span>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase block">Active Workspace Title</label>
                <input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  placeholder="E.g. IIT Delhi Campus"
                  className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                />
              </div>
            </div>

            {/* List and CRUD Registered Depots */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase block">
                Registered Depots ({campuses.length})
              </span>

              {editingCampusId ? (
                /* Edit Campus Subform */
                <form onSubmit={handleEditCampusSave} className="p-3.5 rounded-xl border border-emerald-400/20 bg-emerald-950/10 space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[9px] font-black text-emerald-400 uppercase">✏️ Edit Campus Depot</span>
                    <button type="button" onClick={() => setEditingCampusId(null)} className="text-[9px] font-bold text-slate-400 hover:text-slate-200">
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Campus Name</label>
                      <input
                        type="text"
                        value={editCampusName}
                        onChange={(e) => setEditCampusName(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Director</label>
                      <input
                        type="text"
                        value={editCampusHead}
                        onChange={(e) => setEditCampusHead(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Address</label>
                      <input
                        type="text"
                        value={editCampusAddress}
                        onChange={(e) => setEditCampusAddress(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Phone</label>
                      <input
                        type="text"
                        value={editCampusPhone}
                        onChange={(e) => setEditCampusPhone(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Latitude</label>
                      <input
                        type="text"
                        value={editCampusLat}
                        onChange={(e) => setEditCampusLat(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Longitude</label>
                      <input
                        type="text"
                        value={editCampusLng}
                        onChange={(e) => setEditCampusLng(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-1.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-black uppercase hover:bg-emerald-500/30 active:scale-95 transition-all">
                    Commit Depot Registry
                  </button>
                </form>
              ) : (
                /* Campus List view */
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5 no-scrollbar">
                  {campuses.map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-2 rounded-lg border border-white/5 bg-black/40 text-[10px] font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]">{c.logo}</span>
                        <div className="min-w-0">
                          <span className="text-[9px] text-slate-200 block truncate max-w-[120px]">{c.name}</span>
                          <span className="text-[7px] text-slate-500 block">Coord: [{c.lat.toFixed(2)}, {c.lng.toFixed(2)}]</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingCampusId(c.id)
                            setEditCampusName(c.name)
                            setEditCampusHead(c.transportHead)
                            setEditCampusAddress(c.address)
                            setEditCampusPhone(c.phone)
                            setEditCampusLogo(c.logo)
                            setEditCampusLat(c.lat.toString())
                            setEditCampusLng(c.lng.toString())
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase hover:bg-emerald-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            removeCampus(c.id)
                            addNotification(`Admin Config: Campus '${c.name}' depot registry removed.`, "warning")
                          }}
                          className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 font-mono text-[10px]"
                          disabled={campuses.length <= 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deploy New Campus Depot Form */}
            <form onSubmit={handleAddCampus} className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                + Register New Campus Depot
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Campus Name"
                  value={newCampusName}
                  onChange={(e) => setNewCampusName(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Transport Director Name"
                  value={newCampusHead}
                  onChange={(e) => setNewCampusHead(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Depot Address"
                  value={newCampusAddress}
                  onChange={(e) => setNewCampusAddress(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Depot Phone"
                  value={newCampusPhone}
                  onChange={(e) => setNewCampusPhone(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Latitude (e.g. 19.07)"
                  value={newCampusLat}
                  onChange={(e) => setNewCampusLat(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Longitude (e.g. 72.87)"
                  value={newCampusLng}
                  onChange={(e) => setNewCampusLng(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-1.5">
                  {["🏫", "🕌", "🏭", "🏢"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewCampusLogo(emoji)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-sm border transition-all ${
                        newCampusLogo === emoji ? "border-emerald-400 bg-emerald-500/10" : "border-white/5 bg-slate-900/40"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-black uppercase hover:bg-emerald-500/30 active:scale-95 transition-all"
                >
                  Deploy Depot
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ==================== TAB 4: RFID ATTENDANCE LOGS ==================== */}
        {activeTab === "attendance" && (
          <div className="space-y-4">
            
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase block">
                NFC / RFID Scan Records
              </span>

              {editingLogId ? (
                /* Edit Log Subform */
                <form onSubmit={handleEditAttendanceSave} className="p-3.5 rounded-xl border border-amber-400/20 bg-amber-950/10 space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[9px] font-black text-amber-400 uppercase">✏️ Correct RFID Log</span>
                    <button type="button" onClick={() => setEditingLogId(null)} className="text-[9px] font-bold text-slate-400 hover:text-slate-200">
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Student Name</label>
                      <input
                        type="text"
                        value={editStudentName}
                        onChange={(e) => setEditStudentName(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Roll Number</label>
                      <input
                        type="text"
                        value={editRollNumber}
                        onChange={(e) => setEditRollNumber(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Shuttle ID</label>
                      <input
                        type="text"
                        value={editStudentBusId}
                        onChange={(e) => setEditStudentBusId(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Boarding Stop</label>
                      <input
                        type="text"
                        value={editStopName}
                        onChange={(e) => setEditStopName(e.target.value)}
                        className="w-full glass-input text-[9px] px-2 py-1.5 rounded-md font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Sensor Type</label>
                      <select
                        value={editLogType}
                        onChange={(e) => setEditLogType(e.target.value as any)}
                        className="w-full glass-input text-[9px] px-1.5 py-1.5 rounded-md font-bold bg-slate-950"
                      >
                        <option value="RFID Tap">RFID Tap</option>
                        <option value="QR Scan">QR Scan</option>
                        <option value="NFC Detect">NFC Detect</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-1.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase hover:bg-amber-500/30 active:scale-95 transition-all">
                    Commit RFID Log Correction
                  </button>
                </form>
              ) : (
                /* Attendance Log List view */
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-0.5 no-scrollbar">
                  {attendanceLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-2 rounded-lg border border-white/5 bg-black/40 text-[10px] font-bold">
                      <div className="min-w-0">
                        <span className="text-[9px] text-slate-200 block truncate max-w-[130px]">{log.studentName} ({log.rollNumber})</span>
                        <span className="text-[7px] text-slate-500 block mt-0.5">{log.timestamp} • {log.stopName} ({log.type})</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingLogId(log.id)
                            setEditStudentName(log.studentName)
                            setEditRollNumber(log.rollNumber)
                            setEditStudentBusId(log.busId)
                            setEditStopName(log.stopName)
                            setEditLogType(log.type)
                          }}
                          className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase hover:bg-amber-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            removeAttendanceLog(log.id)
                            addNotification(`Admin Config: RFID scan timeline entry removed.`, "warning")
                          }}
                          className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 font-mono text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mock RFID Scan Insertion Form */}
            <form onSubmit={handleAddAttendance} className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                + Simulate RFID Scan (Insert)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Student Full Name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Roll Number (e.g. IIT2026)"
                  value={newRollNumber}
                  onChange={(e) => setNewRollNumber(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Stop (e.g. Depot)"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold col-span-2"
                  required
                />
                <select
                  value={newLogType}
                  onChange={(e) => setNewLogType(e.target.value as any)}
                  className="glass-input text-[9px] px-1.5 py-1.5 rounded-lg bg-slate-900 font-bold border border-white/5 outline-none"
                >
                  <option value="RFID Tap">RFID Tap</option>
                  <option value="QR Scan">QR Scan</option>
                  <option value="NFC Detect">NFC Detect</option>
                </select>
              </div>
              <div className="flex gap-2">
                <select
                  value={newStudentBusId}
                  onChange={(e) => setNewStudentBusId(e.target.value)}
                  className="flex-1 glass-input text-[9px] px-2 py-1.5 rounded-lg bg-slate-900 font-bold border border-white/5 outline-none"
                >
                  {buses.map((b) => (
                    <option key={b.busId} value={b.busId} className="bg-slate-950 text-slate-200">
                      {b.busId}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase hover:bg-amber-500/30 active:scale-95 transition-all"
                >
                  Insert Tap
                </button>
              </div>
            </form>

          </div>
        )}

      </div>

    </div>
  )
}
