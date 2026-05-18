import { useBusStore, Bus } from "@/store/busStore"

let simIntervalId: NodeJS.Timeout | null = null

// Helper to trigger browser speech synthesis vocal announcements
function speakAnnouncement(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const { voiceEnabled } = useBusStore.getState()
    if (!voiceEnabled) return

    window.speechSynthesis.cancel() // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
  }
}

// Calculate bearing angle (heading) between two GPS points
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const y = Math.sin(dLng) * Math.cos(lat2 * (Math.PI / 180))
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLng)
  let bearing = Math.atan2(y, x) * (180 / Math.PI)
  return (bearing + 360) % 360
}

// Start simulation loop
export function startSimulation() {
  if (simIntervalId) return

  simIntervalId = setInterval(() => {
    const { isSimulating, simSpeed, updateBusPositions, addNotification, routes } = useBusStore.getState()

    if (!isSimulating) return

    updateBusPositions((prevBuses) => {
      return prevBuses.map((bus) => {
        const route = routes.find((r) => r.id === bus.routeId)
        if (!route) return bus

        const path = route.path
        const pathLen = path.length

        // Step index increment
        let nextIndex = bus.currentPathIndex + 1 * simSpeed
        let didWrap = false

        if (nextIndex >= pathLen) {
          nextIndex = 0
          didWrap = true
        }

        const currentPos = path[bus.currentPathIndex]
        const nextPos = path[nextIndex]

        // Calculate heading bearing
        const heading = calculateBearing(currentPos[0], currentPos[1], nextPos[0], nextPos[1])

        // Determine if approaching a stop
        let currentNextStop = bus.nextStop
        let etaMinutes = bus.etaMinutes
        let speed = bus.speed
        let passengers = bus.passengers
        let status = bus.status
        let fuelLevel = Math.max(0, bus.fuelLevel - 0.12 * simSpeed)

        // Refuel trigger
        if (fuelLevel <= 10) {
          fuelLevel = 100
          const msg = `${bus.busId} has completed automated refuelling.`
          addNotification(msg, "success", bus.busId)
          speakAnnouncement(msg)
        }

        // Find nearest upcoming stop on path
        const stopSegmentSize = Math.floor(pathLen / route.stops.length)
        const stopIndex = Math.min(
          route.stops.length - 1,
          Math.floor(nextIndex / stopSegmentSize)
        )
        const currentTargetStop = route.stops[stopIndex]

        if (currentTargetStop) {
          currentNextStop = currentTargetStop.name

          // Arrived at stop
          const isAtStop = nextIndex % stopSegmentSize === 0
          if (isAtStop) {
            speed = 0
            // Exchange passengers
            const modifier = Math.floor(Math.random() * 9) - 4 // -4 to +4
            passengers = Math.min(bus.capacity, Math.max(5, bus.passengers + modifier))
            
            const msg = `${bus.busId} has arrived at ${currentTargetStop.name}. Boarding in progress.`
            addNotification(msg, "info", bus.busId)
            speakAnnouncement(`${bus.busId} at ${currentTargetStop.name}`)
            
            // Randomly trigger congestion alerts near stations
            if (Math.random() < 0.15) {
              status = "heavy-traffic"
              addNotification(
                `High traffic alert detected near ${currentTargetStop.name} for ${bus.busId}.`,
                "warning",
                bus.busId
              )
            } else {
              status = "on-time"
            }
          } else {
            // Simulated cruise speeds based on route types
            const baseSpeed = bus.routeId === "route-orr" ? 65 : bus.routeId === "route-hitech" ? 45 : 30
            const noise = Math.floor(Math.random() * 11) - 5 // -5 to +5
            
            if (status === "heavy-traffic") {
              speed = Math.max(12, Math.floor(baseSpeed * 0.4 + noise))
            } else {
              speed = Math.max(20, baseSpeed + noise)
            }

            // AI Safety Monitoring: Overspeed Detection (Trigger if > 55km/h on non-ring roads)
            if (speed > 55 && bus.routeId !== "route-orr" && Math.random() < 0.2) {
              const msg = `AI Safety Alert: Overspeed incident detected on ${bus.busId} (${speed} km/h).`
              addNotification(msg, "error", bus.busId)
              speakAnnouncement(`Warning: ${bus.busId} overspeed`)
            }
          }

          // Calculate visual dynamic ETA based on indexes remaining
          const remainingIndices = (stopSegmentSize - (nextIndex % stopSegmentSize)) % stopSegmentSize
          etaMinutes = Math.max(1, Math.ceil(remainingIndices / (2 / simSpeed)))
        }

        // AI Safety Monitoring: Route Deviation Alert (1% chance)
        if (Math.random() < 0.008) {
          status = "delayed"
          const msg = `AI Security Alert: Unauthorized route deviation warning triggered for ${bus.busId}.`
          addNotification(msg, "error", bus.busId)
          speakAnnouncement(`Deviation alert: ${bus.busId}`)
        }

        return {
          ...bus,
          lat: nextPos[0],
          lng: nextPos[1],
          heading,
          speed,
          passengers,
          fuelLevel,
          status,
          nextStop: currentNextStop,
          etaMinutes,
          currentPathIndex: nextIndex
        }
      })
    })
  }, 1500)
}

// Stop simulation loop
export function stopSimulation() {
  if (simIntervalId) {
    clearInterval(simIntervalId)
    simIntervalId = null
  }
}
