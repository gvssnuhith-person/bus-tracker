"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap } from "react-leaflet"
import { useBusStore, Bus, Campus } from "@/store/busStore"
import L from "leaflet"

// Sub-component to programmatically control panning and zoom behavior on select
interface MapControllerProps {
  selectedBus: Bus | null
  selectedCampus: Campus | null
}

function MapController({ selectedBus, selectedCampus }: MapControllerProps) {
  const map = useMap()
  const lastSelectedBusId = useRef<string | null>(null)
  const lastSelectedCampusId = useRef<string | null>(null)

  useEffect(() => {
    if (selectedBus) {
      const isNewSelection = lastSelectedBusId.current !== selectedBus.busId
      lastSelectedBusId.current = selectedBus.busId
      lastSelectedCampusId.current = null

      if (isNewSelection) {
        // Zoom and center on selected vehicle
        map.setView([selectedBus.lat, selectedBus.lng], 14, { animate: true, duration: 1 })
      } else {
        // Smooth follow
        map.panTo([selectedBus.lat, selectedBus.lng], { animate: true, duration: 0.8 })
      }
    }
  }, [selectedBus, map])

  useEffect(() => {
    if (selectedCampus) {
      const isNewSelection = lastSelectedCampusId.current !== selectedCampus.id
      lastSelectedCampusId.current = selectedCampus.id
      lastSelectedBusId.current = null

      if (isNewSelection) {
        // Zoom and center on selected campus depot anywhere in India
        map.setView([selectedCampus.lat, selectedCampus.lng], 13, { animate: true, duration: 1.2 })
      }
    }
  }, [selectedCampus, map])

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

// Custom HTML marker for route stops
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

// Custom HTML glowing marker for Campus Depots across India
function createCampusMarkerIcon(logo: string) {
  return L.divIcon({
    className: "custom-campus-marker-wrapper",
    html: `
      <div class="relative flex items-center justify-center w-9 h-9 transition-all duration-300">
        <!-- Glowing Amber Circle -->
        <div class="absolute inset-0 rounded-xl bg-slate-950/95 border-2 border-amber-400/80 shadow-md shadow-amber-500/20 flex items-center justify-center text-base">
          ${logo}
        </div>
        <div class="absolute -inset-0.5 rounded-xl border border-amber-400/20 animate-pulse pointer-events-none"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

// Floating button to reset map view to entire map of India
function IndiaViewReset({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="absolute top-4 left-4 z-[999] px-3.5 py-2.5 rounded-xl glass-panel border border-white/10 hover:border-amber-400/40 text-[10px] font-black uppercase text-amber-300 tracking-wider shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
    >
      <span>🌐</span> India View
    </button>
  )
}

export default function LiveMap() {
  const { buses, routes, campuses, selectedBusId, setSelectedBusId, heatmapEnabled } = useBusStore()
  const mapRef = useRef<L.Map | null>(null)

  // Zooming out default centers map at India's geographic center
  const indiaCenterLat = 20.5937
  const indiaCenterLng = 78.9629

  const selectedBus = buses.find((b) => b.busId === selectedBusId) || null

  // Link selected campus (to pan map when a campus is registered or highlighted)
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null)

  const handleIndiaReset = () => {
    setSelectedBusId(null)
    setSelectedCampus(null)
    if (mapRef.current) {
      mapRef.current.setView([indiaCenterLat, indiaCenterLng], 5, { animate: true, duration: 1.5 })
    }
  }

  return (
    <div className="w-full h-full relative z-0">
      
      {/* Floating reset map button */}
      <IndiaViewReset onReset={handleIndiaReset} />

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
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-amber-400">Campus Depots</span>
        </div>
      </div>

      <MapContainer
        center={[indiaCenterLat, indiaCenterLng]}
        zoom={5}
        className="w-full h-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedBus={selectedBus} selectedCampus={selectedCampus} />

        {/* Smart Route Traffic Hotspot Heatmaps */}
        {heatmapEnabled && (
          <>
            {/* Gachibowli delay zone */}
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
            {/* Ameerpet delay zone */}
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

        {/* Registered Campus Depots Markers across India */}
        {campuses.map((campus) => (
          <Marker
            key={campus.id}
            position={[campus.lat, campus.lng]}
            icon={createCampusMarkerIcon(campus.logo)}
            eventHandlers={{
              click: () => {
                setSelectedCampus(campus)
              },
            }}
          >
            <Popup>
              <div className="p-2 text-xs w-[190px]">
                <div className="flex justify-between items-center font-bold pb-1 border-b border-slate-700">
                  <span className="text-amber-400">{campus.name}</span>
                  <span className="text-base">{campus.logo}</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1.5 font-medium">{campus.address}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Manager: {campus.transportHead}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Phone: {campus.phone}</p>
                <button
                  onClick={() => setSelectedCampus(campus)}
                  className="mt-2 w-full py-1 text-[8px] font-black uppercase tracking-wider rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all text-center block"
                >
                  🔍 Zoom In Depot
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

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
