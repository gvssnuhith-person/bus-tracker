"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap } from "react-leaflet"
import { useBusStore, Bus } from "@/store/busStore"
import L from "leaflet"

// Sub-component to programmatically control panning and zoom behavior on select
function MapController({ selectedBus }: { selectedBus: Bus | null }) {
  const map = useMap()
  const lastSelectedId = useRef<string | null>(null)

  useEffect(() => {
    if (selectedBus) {
      const isNewSelection = lastSelectedId.current !== selectedBus.busId
      lastSelectedId.current = selectedBus.busId

      if (isNewSelection) {
        // Zoom and center on selection
        map.setView([selectedBus.lat, selectedBus.lng], 14, { animate: true, duration: 1 })
      } else {
        // Follow movement
        map.panTo([selectedBus.lat, selectedBus.lng], { animate: true, duration: 0.8 })
      }
    }
  }, [selectedBus, map])

  return null
}

// Custom HTML glowing marker for active buses
function createBusMarkerIcon(bus: Bus, color: string, isSelected: boolean) {
  return L.divIcon({
    className: "custom-bus-marker-wrapper",
    html: `
      <div class="relative flex items-center justify-center w-9 h-9 transition-all duration-300">
        <!-- Glowing Ring -->
        <div class="absolute inset-0 rounded-full bg-slate-950/90 border-2 transition-all duration-300 ${
          isSelected ? "scale-110 shadow-lg border-cyan-400" : "border-slate-800"
        }" style="box-shadow: ${isSelected ? `0 0 15px ${color}` : "none"}"></div>
        
        <!-- Rotating SVG Arrow -->
        <div class="z-10 flex items-center justify-center w-6 h-6 transition-transform duration-300" style="transform: rotate(${bus.heading}deg)">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="${color}">
            <path d="M12 2L2 22l10-6 10 6L12 2z" />
          </svg>
        </div>

        <!-- Ping Pulse -->
        ${
          isSelected
            ? `<div class="absolute -inset-1.5 rounded-full border border-cyan-400/30 animate-ping pointer-events-none"></div>`
            : ""
        }
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

// Stop custom HTML marker
function createStopMarkerIcon(color: string) {
  return L.divIcon({
    className: "custom-stop-marker-wrapper",
    html: `
      <div class="flex items-center justify-center w-4 h-4">
        <div class="w-3 h-3 rounded-full bg-slate-950 border-2 border-white/60 flex items-center justify-center shadow-md">
          <div class="w-1.5 h-1.5 rounded-full animate-pulse-glow" style="background-color: ${color}"></div>
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function LiveMap() {
  const { buses, routes, selectedBusId, setSelectedBusId, heatmapEnabled } = useBusStore()

  const centerLat = 17.4192
  const centerLng = 78.4350

  const selectedBus = buses.find((b) => b.busId === selectedBusId) || null

  return (
    <div className="w-full h-full relative z-0">
      
      {/* HUD Info Badge */}
      <div className="absolute top-4 right-4 z-[999] glass-panel p-3 rounded-xl flex items-center gap-4 text-xs font-semibold tracking-wide border border-white/10 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
          <span className="text-cyan-300">Hitech</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#bd34fe] animate-pulse"></span>
          <span className="text-purple-300">Charminar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-emerald-300">ORR Commuter</span>
        </div>
      </div>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedBus={selectedBus} />

        {/* Smart Route Traffic Hotspot Heatmaps */}
        {heatmapEnabled && (
          <>
            {/* Hitech delay zone: DLF stop */}
            <Circle
              center={[17.4430, 78.3570]}
              radius={700}
              pathOptions={{
                fillColor: "#ef4444",
                fillOpacity: 0.35,
                color: "#ef4444",
                weight: 1,
              }}
            />
            {/* Charminar delay zone: Ameerpet Stop */}
            <Circle
              center={[17.4374, 78.4482]}
              radius={800}
              pathOptions={{
                fillColor: "#f59e0b",
                fillOpacity: 0.35,
                color: "#f59e0b",
                weight: 1,
              }}
            />
            {/* ORR delay zone: Kukatpally Junction */}
            <Circle
              center={[17.4840, 78.3980]}
              radius={900}
              pathOptions={{
                fillColor: "#ef4444",
                fillOpacity: 0.25,
                color: "#ef4444",
                weight: 1,
              }}
            />
          </>
        )}

        {/* Draw Route Paths */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: route.color,
              weight: 4,
              opacity: 0.75,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        ))}

        {/* Route Stops */}
        {routes.map((route) =>
          route.stops.map((stop, idx) => (
            <Marker
              key={`${route.id}-stop-${idx}`}
              position={[stop.lat, stop.lng]}
              icon={createStopMarkerIcon(route.color)}
            >
              <Popup>
                <div className="text-xs p-1">
                  <h4 className="font-bold text-cyan-400">{stop.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Route: {route.name}</p>
                </div>
              </Popup>
            </Marker>
          ))
        )}

        {/* Moving Active Buses */}
        {buses.map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId)
          const color = route ? route.color : "#00f0ff"
          const isSelected = bus.busId === selectedBusId

          return (
            <Marker
              key={bus.busId}
              position={[bus.lat, bus.lng]}
              icon={createBusMarkerIcon(bus, color, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedBusId(bus.busId)
                },
              }}
            >
              <Popup>
                <div className="p-2 text-xs w-[180px]">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-cyan-400">{bus.busId}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold ${
                        bus.status === "on-time"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : bus.status === "heavy-traffic"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Route: {bus.route}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5 font-medium">
                    Next Stop: <span className="text-cyan-200">{bus.nextStop}</span> ({bus.etaMinutes}m)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Speed: {bus.speed} km/h</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Occupancy: {bus.passengers} / {bus.capacity}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
