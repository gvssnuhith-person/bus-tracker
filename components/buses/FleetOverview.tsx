"use client"

import { useBusStore, Bus } from "@/store/busStore"

export default function FleetOverview() {
  const {
    buses,
    routes,
    selectedBusId,
    setSelectedBusId,
    searchQuery,
    setSearchQuery,
    selectedRouteFilter,
    setSelectedRouteFilter,
  } = useBusStore()

  // Filter logic
  const filteredBuses = buses.filter((bus) => {
    const matchesSearch = bus.busId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bus.nextStop.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRoute = selectedRouteFilter === "all" || bus.routeId === selectedRouteFilter

    return matchesSearch && matchesRoute
  })

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl p-4 min-h-0 border border-white/5">
      
      {/* Search Header */}
      <div className="flex flex-col gap-3 pb-3 border-b border-white/5">
        <h2 className="text-sm font-bold text-slate-400/80 tracking-widest uppercase">Fleet Overview</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search vehicle or stop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input placeholder-slate-500 font-semibold"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Route Filter Tabs */}
      <div className="flex gap-1.5 py-3 overflow-x-auto select-none no-scrollbar shrink-0">
        <button
          onClick={() => setSelectedRouteFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
            selectedRouteFilter === "all"
              ? "bg-white/10 text-cyan-400 border-cyan-500/30"
              : "bg-white/3 text-slate-500 border-transparent hover:text-slate-300"
          }`}
        >
          All
        </button>
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelectedRouteFilter(route.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
              selectedRouteFilter === route.id
                ? "bg-white/10 text-white border-white/10"
                : "bg-white/3 text-slate-500 border-transparent hover:text-slate-300"
            }`}
            style={{
              borderColor: selectedRouteFilter === route.id ? `${route.color}40` : "transparent",
              color: selectedRouteFilter === route.id ? route.color : undefined,
            }}
          >
            {route.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Active Fleet List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
        {filteredBuses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <span className="text-slate-600 text-2xl">🔍</span>
            <p className="text-xs font-semibold text-slate-500 tracking-wide text-center">No active vehicles match filters</p>
          </div>
        ) : (
          filteredBuses.map((bus) => {
            const route = routes.find((r) => r.id === bus.routeId)
            const color = route ? route.color : "#00f0ff"
            const isSelected = bus.busId === selectedBusId

            return (
              <div
                key={bus.busId}
                onClick={() => setSelectedBusId(bus.busId)}
                className={`relative p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? "bg-white/5 border-white/15"
                    : "bg-white/2 border-white/3 hover:bg-white/4 hover:border-white/5"
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 15px ${color}15` : "none",
                  borderLeft: isSelected ? `3px solid ${color}` : `1px solid rgba(255,255,255,${isSelected ? 0.15 : 0.03})`,
                }}
              >
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                      style={{ backgroundColor: color }}
                    ></span>
                    <span className="text-xs font-bold text-slate-200 tracking-wide">{bus.busId}</span>
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-extrabold ${
                      bus.status === "on-time"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : bus.status === "heavy-traffic"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>

                {/* Body Details */}
                <div className="mt-2 space-y-1 text-[11px] font-semibold text-slate-400">
                  <div className="flex justify-between">
                    <span>Next Stop</span>
                    <span className="text-slate-200 truncate max-w-[140px]">{bus.nextStop}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Arrival ETA</span>
                    <span className="text-cyan-400">{bus.etaMinutes} mins</span>
                  </div>

                  {/* Telemetry quick bar */}
                  <div className="flex justify-between pt-1 text-[10px] font-bold text-slate-500">
                    <span>{bus.speed} km/h</span>
                    <span>
                      Occupancy: {bus.passengers}/{bus.capacity}
                    </span>
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(bus.passengers / bus.capacity) * 100}%`,
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
