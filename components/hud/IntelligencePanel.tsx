"use client"

import { useState } from "react"
import { useBusStore, Bus, Route } from "@/store/busStore"

export default function IntelligencePanel() {
  const {
    buses,
    routes,
    selectedBusId,
    setSelectedBusId,
    campusName,
    setCampusName,
    addBus,
    removeBus,
    addRoute,
    removeRoute,
    addNotification,
  } = useBusStore()

  // Tab state
  const [activeTab, setActiveTab] = useState<"telemetry" | "campus">("telemetry")

  // Bus Add form states
  const [newBusId, setNewBusId] = useState("")
  const [newBusRouteId, setNewBusRouteId] = useState(routes[0]?.id || "")
  const [newBusDriverName, setNewBusDriverName] = useState("")

  // Route Add form states
  const [newRouteId, setNewRouteId] = useState("")
  const [newRouteName, setNewRouteName] = useState("")
  const [newRouteColor, setNewRouteColor] = useState("#00f0ff")

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

    // Spawn at the starting path of the assigned route
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
    }

    addBus(busPayload)
    addNotification(`Admin Config: Bus ${busPayload.busId} added and deployed to ${selectedRoute.name}.`, "success", busPayload.busId)

    // Reset fields
    setNewBusId("")
    setNewBusDriverName("")
  }

  // Handle route addition
  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRouteId.trim() || !newRouteName.trim()) return

    // Create a default path around Hyderabad center with 2 default stops
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
    addNotification(`Admin Config: New Route '${routePayload.name}' mapped and visual vector snap uploaded.`, "success")

    // Reset fields
    setNewRouteId("")
    setNewRouteName("")
  }

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl p-4 min-h-0 border border-white/5 select-none">
      
      {/* Dynamic Tab Switcher */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-950/40 border border-white/5 mb-4 shrink-0">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
            activeTab === "telemetry"
              ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shadow-inner"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          📊 Telemetry HUD
        </button>
        <button
          onClick={() => setActiveTab("campus")}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
            activeTab === "campus"
              ? "bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-inner"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          ⚙️ Campus Manager
        </button>
      </div>

      {activeTab === "telemetry" ? (
        /* ==================== TAB 1: TELEMETRY FEED ==================== */
        selectedBus ? (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1 min-h-0 no-scrollbar">
            {/* Panel Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/5 shrink-0">
              <div>
                <h2 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Live Telematics</h2>
                <h3 className="text-sm font-black tracking-tight text-white mt-0.5">{selectedBus.busId}</h3>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block">ROUTE</span>
                <span className="text-[10px] font-extrabold tracking-wide uppercase" style={{ color: color }}>
                  {selectedBus.route.split(" ")[0]}
                </span>
              </div>
            </div>

            {/* Telemetry Gauge Cards */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {/* Velocity HUD */}
              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider">Velocity</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-black font-mono text-cyan-400 tracking-tight">{selectedBus.speed}</span>
                  <span className="text-[8px] font-extrabold text-slate-500">km/h</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (selectedBus.speed / 80) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Battery/Fuel HUD */}
              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider">Battery/Fuel</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span 
                    className="text-xl font-black font-mono tracking-tight"
                    style={{ 
                      color: selectedBus.fuelLevel > 50 
                        ? "#10b981" 
                        : selectedBus.fuelLevel > 20 
                        ? "#f59e0b" 
                        : "#ef4444" 
                    }}
                  >
                    {Math.round(selectedBus.fuelLevel)}
                  </span>
                  <span className="text-[8px] font-extrabold text-slate-500">%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${selectedBus.fuelLevel}%`,
                      backgroundColor: selectedBus.fuelLevel > 50 
                        ? "#10b981" 
                        : selectedBus.fuelLevel > 20 
                        ? "#f59e0b" 
                        : "#ef4444"
                    }}
                  ></div>
                </div>
              </div>

              {/* Occupancy */}
              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider">Occupancy</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-black font-mono text-purple-400 tracking-tight">
                    {Math.round((selectedBus.passengers / selectedBus.capacity) * 100)}
                  </span>
                  <span className="text-[8px] font-extrabold text-slate-500">%</span>
                </div>
                <p className="text-[8px] font-bold text-slate-500 mt-2">
                  {selectedBus.passengers} / {selectedBus.capacity} passengers
                </p>
              </div>

              {/* Heading bearing */}
              <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider">Heading</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-black font-mono text-emerald-400 tracking-tight">
                    {getDirection(selectedBus.heading)}
                  </span>
                  <span className="text-[8px] font-extrabold text-slate-500">{Math.round(selectedBus.heading)}°</span>
                </div>
                <p className="text-[8px] font-bold text-slate-500 mt-2">Geo-direction bearing</p>
              </div>
            </div>

            {/* Driver profile */}
            <div className="glass-panel p-3 rounded-xl border border-white/5 shrink-0">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider block">Assigned Driver</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-center text-lg">
                  {selectedBus.driver.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-200 truncate">
                      {selectedBus.driver.name}
                    </h4>
                    <div className="flex items-center gap-0.5 text-amber-400 text-[9px] font-black">
                      <span>★</span>
                      <span>{selectedBus.driver.rating}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                    {selectedBus.driver.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Stops progress timeline */}
            <div className="flex-1 min-h-[150px] pb-2">
              <span className="text-[9px] font-bold text-slate-500 tracking-widest block uppercase mb-3">
                Route stops timeline
              </span>

              <div className="relative pl-6 space-y-3 border-l border-white/5 ml-2.5">
                {route?.stops.map((stop, idx) => {
                  const stopSegmentSize = Math.floor(route.path.length / route.stops.length)
                  const currentStep = Math.floor(selectedBus.currentPathIndex / stopSegmentSize)
                  
                  const isPassed = idx < currentStep
                  const isCurrent = idx === currentStep

                  return (
                    <div key={idx} className="relative flex flex-col justify-center">
                      <div 
                        className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isPassed 
                            ? "bg-slate-950 border-emerald-500 text-emerald-400" 
                            : isCurrent 
                            ? "bg-slate-950 scale-110 border-cyan-400 text-cyan-300 map-stop-pulse" 
                            : "bg-slate-950 border-slate-700 text-slate-500"
                        }`}
                      >
                        {isPassed ? (
                          <span className="text-[8px] font-extrabold">✓</span>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ 
                            backgroundColor: isCurrent ? "#00f0ff" : "#475569" 
                          }}></div>
                        )}
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className={`text-xs font-bold transition-all ${
                            isCurrent ? "text-cyan-300 font-extrabold" : isPassed ? "text-slate-500 line-through" : "text-slate-300"
                          }`}>
                            {stop.name}
                          </h4>
                        </div>
                        {isCurrent && (
                          <div className="bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg text-right shrink-0">
                            <span className="text-[9px] font-black text-cyan-400 tracking-wide font-mono">
                              {selectedBus.etaMinutes} mins
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-center items-center text-center">
            <span className="text-slate-600 text-2xl animate-pulse">📡</span>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">No Bus Selected</h3>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">Select a vehicle from the fleet panel to track telematics.</p>
          </div>
        )
      ) : (
        /* ==================== TAB 2: CAMPUS MANAGER ==================== */
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1 min-h-0 no-scrollbar">
          
          {/* SECTION 1: Change Campus Name */}
          <div className="p-3 rounded-xl border border-white/5 glass-panel bg-slate-950/20">
            <span className="text-[9px] font-black text-slate-500 tracking-widest block uppercase mb-2">
              Campus Registry Settings
            </span>
            <div className="space-y-1">
              <label className="text-[8px] font-bold text-slate-400 uppercase block">Campus Name</label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                placeholder="E.g. IIT Hyderabad Campus"
                className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
              />
            </div>
          </div>

          {/* SECTION 2: Dynamic Buses CRUD */}
          <div className="p-3 rounded-xl border border-white/5 glass-panel bg-slate-950/20 space-y-3">
            <span className="text-[9px] font-black text-slate-500 tracking-widest block uppercase">
              Fleet Shuttles Manager ({buses.length})
            </span>

            {/* List and Delete Buses */}
            <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              {buses.map((bus) => (
                <div
                  key={bus.busId}
                  className="flex justify-between items-center px-2.5 py-1.5 rounded-lg border border-white/3 bg-white/2 text-[10px] font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-400">{bus.busId}</span>
                    <span className="text-[8px] text-slate-500 truncate max-w-[100px]">{bus.driver.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      removeBus(bus.busId)
                      if (selectedBusId === bus.busId) setSelectedBusId(null)
                      addNotification(`Admin Config: Bus ${bus.busId} decommissioned from active deployment.`, "warning")
                    }}
                    className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 active:scale-90 transition-all font-mono"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Bus Form */}
            <form onSubmit={handleAddBus} className="border-t border-white/5 pt-2.5 space-y-2">
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                + Deploy New Shuttle
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="BUS ID (e.g. BUS-800)"
                  value={newBusId}
                  onChange={(e) => setNewBusId(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Driver Name"
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
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[9px] font-black uppercase hover:bg-cyan-500/30 active:scale-95 transition-all"
                >
                  Deploy
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: Dynamic Routes CRUD */}
          <div className="p-3 rounded-xl border border-white/5 glass-panel bg-slate-950/20 space-y-3">
            <span className="text-[9px] font-black text-slate-500 tracking-widest block uppercase">
              Campus Lines & Routes ({routes.length})
            </span>

            {/* List and Delete Routes */}
            <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              {routes.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center px-2.5 py-1.5 rounded-lg border border-white/3 bg-white/2 text-[10px] font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                    <span className="text-[9px] text-slate-200 truncate max-w-[120px]">{r.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      removeRoute(r.id)
                      addNotification(`Admin Config: Route '${r.name}' decommissioned. Paths cleared.`, "warning")
                    }}
                    className="w-5 h-5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 active:scale-90 transition-all font-mono"
                    disabled={routes.length <= 1} // Prevent removing the last route
                    title={routes.length <= 1 ? "Cannot delete the sole campus route line" : "Delete Route"}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Route Form */}
            <form onSubmit={handleAddRoute} className="border-t border-white/5 pt-2.5 space-y-2">
              <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block">
                + Map New Campus Line
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Route Code (e.g. route-orr)"
                  value={newRouteId}
                  onChange={(e) => setNewRouteId(e.target.value)}
                  className="glass-input text-[9px] px-2.5 py-1.5 rounded-lg font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Line Name (e.g. ORR Commuter)"
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
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-black uppercase hover:bg-purple-500/30 active:scale-95 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  )
}
