"use client"

import { useBusStore, Bus } from "@/store/busStore"

export default function IntelligencePanel() {
  const { buses, routes, selectedBusId } = useBusStore()

  const selectedBus = buses.find((b) => b.busId === selectedBusId) || null
  const route = selectedBus ? routes.find((r) => r.id === selectedBus.routeId) : null
  const color = route ? route.color : "#00f0ff"

  if (!selectedBus) {
    return (
      <div className="flex flex-col h-full glass-panel rounded-2xl p-6 justify-center items-center text-center border border-white/5">
        <svg className="w-12 h-12 text-slate-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">No Vehicle Selected</h3>
        <p className="text-xs text-slate-500 mt-2 font-medium">Select an active bus from the fleet list or geographic map to initialize telemetry feed.</p>
      </div>
    )
  }

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

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl p-4 min-h-0 border border-white/5 select-none">
      
      {/* Telematics Detail Panel */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1 min-h-0">
        
        {/* Panel Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <div>
            <h2 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Telemetry HUD</h2>
            <h3 className="text-lg font-black tracking-tight text-white mt-0.5">{selectedBus.busId}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider block">ROUTE</span>
            <span className="text-xs font-extrabold tracking-wide uppercase" style={{ color: color }}>
              {selectedBus.route.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Telemetry Gauge Cards */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          
          {/* Velocity HUD */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">Velocity</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight">{selectedBus.speed}</span>
              <span className="text-[9px] font-extrabold text-slate-500">km/h</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (selectedBus.speed / 80) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Fuel Level HUD */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">Battery/Fuel</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span 
                className="text-2xl font-black font-mono tracking-tight"
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
              <span className="text-[9px] font-extrabold text-slate-500">%</span>
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

          {/* Capacity HUD */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">Occupancy</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black font-mono text-purple-400 tracking-tight">
                {Math.round((selectedBus.passengers / selectedBus.capacity) * 100)}
              </span>
              <span className="text-[9px] font-extrabold text-slate-500">%</span>
            </div>
            <p className="text-[9px] font-bold text-slate-500 mt-2">
              {selectedBus.passengers} / {selectedBus.capacity} passengers
            </p>
          </div>

          {/* Heading Compass HUD */}
          <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">Heading</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                {getDirection(selectedBus.heading)}
              </span>
              <span className="text-[9px] font-extrabold text-slate-500">{Math.round(selectedBus.heading)}°</span>
            </div>
            <p className="text-[9px] font-bold text-slate-500 mt-2">Geo-direction bearing</p>
          </div>
        </div>

        {/* Driver Profile Section */}
        <div className="glass-panel p-3 rounded-xl border border-white/5 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider block">Assigned Driver</span>
          <div className="flex items-center gap-3 mt-2.5">
            <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-xl shadow-inner">
              {selectedBus.driver.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-200 tracking-wide truncate">
                  {selectedBus.driver.name}
                </h4>
                <div className="flex items-center gap-0.5 shrink-0 text-amber-400 text-[10px] font-black">
                  <span>★</span>
                  <span>{selectedBus.driver.rating}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                {selectedBus.driver.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Chronological Progressive Stops Timeline */}
        <div className="flex-1 min-h-[180px] mt-2 pb-2">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest block uppercase mb-4">
            Route stops timeline
          </span>

          <div className="relative pl-6 space-y-4 border-l border-white/5 ml-2.5">
            {route?.stops.map((stop, idx) => {
              const stopSegmentSize = Math.floor(route.path.length / route.stops.length)
              const currentStep = Math.floor(selectedBus.currentPathIndex / stopSegmentSize)
              
              const isPassed = idx < currentStep
              const isCurrent = idx === currentStep
              const isUpcoming = idx > currentStep

              return (
                <div key={idx} className="relative flex flex-col justify-center">
                  
                  {/* Visual Node Dot */}
                  <div 
                    className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isPassed 
                        ? "bg-slate-950 border-emerald-500 text-emerald-400" 
                        : isCurrent 
                        ? "bg-slate-950 scale-125 border-cyan-400 text-cyan-300 map-stop-pulse" 
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

                  {/* Stop Name & Telematics Details */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className={`text-xs font-bold transition-all ${
                        isCurrent ? "text-cyan-300 font-extrabold" : isPassed ? "text-slate-500 line-through" : "text-slate-300"
                      }`}>
                        {stop.name}
                      </h4>
                      {isCurrent && (
                        <p className="text-[9px] font-bold text-cyan-400/80 tracking-wide uppercase mt-0.5">
                          Immediate next stop
                        </p>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg text-right shrink-0">
                        <span className="text-[10px] font-black text-cyan-400 tracking-wide font-mono">
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
    </div>
  )
}
