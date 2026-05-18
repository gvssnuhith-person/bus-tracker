import { create } from "zustand"

export interface Bus {
  busId: string
  route: string
  routeId: string
  lat: number
  lng: number
  speed: number
  heading: number
  passengers: number
  capacity: number
  fuelLevel: number
  status: "on-time" | "delayed" | "heavy-traffic"
  nextStop: string
  driver: {
    name: string
    avatar: string
    phone: string
    rating: number
  }
  etaMinutes: number
  currentPathIndex: number
}

export interface RouteStop {
  name: string
  lat: number
  lng: number
}

export interface Route {
  id: string
  name: string
  color: string
  stops: RouteStop[]
  path: [number, number][] // Interpolated road path coordinates
}

export interface NotificationLog {
  id: string
  message: string
  severity: "info" | "warning" | "error" | "success"
  timestamp: string
  busId?: string
}

interface BusState {
  buses: Bus[]
  routes: Route[]
  selectedBusId: string | null
  searchQuery: string
  selectedRouteFilter: string
  isSimulating: boolean
  simSpeed: 1 | 2 | 5
  notifications: NotificationLog[]
  
  // Actions
  setSelectedBusId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedRouteFilter: (route: string) => void
  toggleSimulation: () => void
  setSimSpeed: (speed: 1 | 2 | 5) => void
  updateBusPositions: (updater: (prevBuses: Bus[]) => Bus[]) => void
  addNotification: (message: string, severity: NotificationLog["severity"], busId?: string) => void
  clearNotifications: () => void
}

// Helper to interpolate between two GPS points
function interpolatePath(points: [number, number][], stepsPerSegment: number = 30): [number, number][] {
  const path: [number, number][] = []
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    const end = points[i + 1]
    for (let step = 0; step < stepsPerSegment; step++) {
      const ratio = step / stepsPerSegment
      const lat = start[0] + (end[0] - start[0]) * ratio
      const lng = start[1] + (end[1] - start[1]) * ratio
      path.push([lat, lng])
    }
  }
  path.push(points[points.length - 1])
  return path
}

// Real Hyderabad Geographic Coordinates for Route Stops
const HYD_ROUTES: Route[] = [
  {
    id: "route-hitech",
    name: "Hitech City Express",
    color: "#00f0ff", // Cyan
    stops: [
      { name: "Gachibowli DLF", lat: 17.4475, lng: 78.3615 },
      { name: "Hitech City Hub", lat: 17.4483, lng: 78.3804 },
      { name: "Jubilee Hills Checkpost", lat: 17.4265, lng: 78.4116 },
      { name: "Begumpet Station", lat: 17.4394, lng: 78.4611 },
      { name: "Secunderabad Junction", lat: 17.4334, lng: 78.5015 }
    ],
    path: interpolatePath([
      [17.4475, 78.3615],
      [17.4495, 78.3705],
      [17.4483, 78.3804],
      [17.4365, 78.3955],
      [17.4265, 78.4116],
      [17.4255, 78.4350],
      [17.4394, 78.4611],
      [17.4422, 78.4820],
      [17.4334, 78.5015]
    ])
  },
  {
    id: "route-charminar",
    name: "Charminar Heritage Line",
    color: "#bd34fe", // Purple
    stops: [
      { name: "Charminar Palace", lat: 17.3616, lng: 78.4747 },
      { name: "Koti Center", lat: 17.3828, lng: 78.4842 },
      { name: "Nampally Metro", lat: 17.3872, lng: 78.4682 },
      { name: "Lakdikapul", lat: 17.4022, lng: 78.4612 },
      { name: "Ameerpet Station", lat: 17.4360, lng: 78.4439 }
    ],
    path: interpolatePath([
      [17.3616, 78.4747],
      [17.3712, 78.4795],
      [17.3828, 78.4842],
      [17.3852, 78.4760],
      [17.3872, 78.4682],
      [17.3942, 78.4645],
      [17.4022, 78.4612],
      [17.4190, 78.4520],
      [17.4360, 78.4439]
    ])
  },
  {
    id: "route-orr",
    name: "Outer Ring Commuter",
    color: "#10b981", // Emerald Green
    stops: [
      { name: "Gachibowli Circle", lat: 17.4192, lng: 78.3489 },
      { name: "Miyapur Metro", lat: 17.4948, lng: 78.3534 },
      { name: "Kukatpally Junction", lat: 17.4841, lng: 78.3974 },
      { name: "Secunderabad Metro", lat: 17.4385, lng: 78.4988 }
    ],
    path: interpolatePath([
      [17.4192, 78.3489],
      [17.4410, 78.3395],
      [17.4685, 78.3412],
      [17.4948, 78.3534],
      [17.4912, 78.3755],
      [17.4841, 78.3974],
      [17.4615, 78.4350],
      [17.4490, 78.4680],
      [17.4385, 78.4988]
    ])
  }
]

// Predefined Fleet list on launch
const INITIAL_BUSES: Bus[] = [
  {
    busId: "BUS-104",
    route: "Hitech City Express",
    routeId: "route-hitech",
    lat: 17.4475,
    lng: 78.3615,
    speed: 45,
    heading: 45,
    passengers: 34,
    capacity: 60,
    fuelLevel: 82,
    status: "on-time",
    nextStop: "Hitech City Hub",
    driver: {
      name: "Ramesh Kumar",
      avatar: "👨‍✈️",
      phone: "+91 98480 22338",
      rating: 4.8
    },
    etaMinutes: 4,
    currentPathIndex: 0
  },
  {
    busId: "BUS-202",
    route: "Charminar Heritage Line",
    routeId: "route-charminar",
    lat: 17.3616,
    lng: 78.4747,
    speed: 28,
    heading: 90,
    passengers: 52,
    capacity: 55,
    fuelLevel: 64,
    status: "heavy-traffic",
    nextStop: "Koti Center",
    driver: {
      name: "Mohammad Ali",
      avatar: "🧔",
      phone: "+91 94401 55667",
      rating: 4.9
    },
    etaMinutes: 12,
    currentPathIndex: 0
  },
  {
    busId: "BUS-500",
    route: "Outer Ring Commuter",
    routeId: "route-orr",
    lat: 17.4192,
    lng: 78.3489,
    speed: 65,
    heading: 320,
    passengers: 21,
    capacity: 70,
    fuelLevel: 94,
    status: "on-time",
    nextStop: "Miyapur Metro",
    driver: {
      name: "K. Srinivasan",
      avatar: "👴",
      phone: "+91 99890 11224",
      rating: 4.7
    },
    etaMinutes: 8,
    currentPathIndex: 0
  }
]

const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: "notif-1",
    message: "Hitech City Express fleet initialized successfully.",
    severity: "success",
    timestamp: new Date(Date.now() - 300000).toLocaleTimeString()
  },
  {
    id: "notif-2",
    message: "BUS-202 experiencing slow speeds on Hyderabad heritage stretch.",
    severity: "warning",
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
    busId: "BUS-202"
  }
]

export const useBusStore = create<BusState>((set) => ({
  buses: INITIAL_BUSES,
  routes: HYD_ROUTES,
  selectedBusId: "BUS-104", // Select the first bus on start
  searchQuery: "",
  selectedRouteFilter: "all",
  isSimulating: true,
  simSpeed: 1,
  notifications: INITIAL_NOTIFICATIONS,

  setSelectedBusId: (id) => set({ selectedBusId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRouteFilter: (route) => set({ selectedRouteFilter: route }),
  toggleSimulation: () => set((state) => ({ isSimulating: !state.isSimulating })),
  setSimSpeed: (speed) => set({ simSpeed: speed }),
  
  updateBusPositions: (updater) => set((state) => ({ buses: updater(state.buses) })),
  
  addNotification: (message, severity, busId) => set((state) => {
    const newNotif: NotificationLog = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      severity,
      timestamp: new Date().toLocaleTimeString(),
      busId
    }
    return {
      notifications: [newNotif, ...state.notifications].slice(0, 30) // Cap at 30 notifications
    }
  }),
  
  clearNotifications: () => set({ notifications: [] })
}))
