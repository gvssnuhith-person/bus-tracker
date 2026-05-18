import { create } from "zustand"

export type UserRole = "admin" | "student" | "parent" | "driver"

export interface DriverInfo {
  name: string
  avatar: string
  rating: number
  phone: string
}

export interface StudentAttendance {
  id: string
  studentName: string
  rollNumber: string
  busId: string
  stopName: string
  timestamp: string
  type: "RFID Tap" | "QR Scan" | "NFC Detect"
}

export interface Bus {
  busId: string
  routeId: string
  route: string
  lat: number
  lng: number
  heading: number
  speed: number
  capacity: number
  passengers: number
  fuelLevel: number
  status: "on-time" | "heavy-traffic" | "delayed"
  nextStop: string
  etaMinutes: number
  driver: DriverInfo
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
  path: [number, number][]
}

export interface NotificationLog {
  id: string
  message: string
  severity: "info" | "success" | "warning" | "error"
  timestamp: string
  busId?: string
}

interface BusState {
  // Authentication & Roles
  activeRole: UserRole
  setActiveRole: (role: UserRole) => void

  // Telemetry Lists
  buses: Bus[]
  routes: Route[]
  selectedBusId: string | null
  setSelectedBusId: (id: string | null) => void

  // Filters
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedRouteFilter: string
  setSelectedRouteFilter: (routeId: string) => void

  // Real-Time Simulator Variables
  isSimulating: boolean
  setSimulating: (sim: boolean) => void
  simSpeed: number
  setSimSpeed: (speed: number) => void
  updateBusPositions: (updater: (prev: Bus[]) => Bus[]) => void

  // Notification Engine
  notifications: NotificationLog[]
  addNotification: (message: string, severity?: "info" | "success" | "warning" | "error", busId?: string) => void
  clearNotifications: () => void

  // Smart Campus Features
  attendanceLogs: StudentAttendance[]
  addAttendanceLog: (log: Omit<StudentAttendance, "id" | "timestamp">) => void
  sosTriggered: boolean
  setSosTriggered: (triggered: boolean) => void
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  heatmapEnabled: boolean
  setHeatmapEnabled: (enabled: boolean) => void
  driverCompletedStops: string[]
  toggleDriverStop: (stopName: string) => void

  // Admin CRUD Settings
  campusName: string
  setCampusName: (name: string) => void
  addBus: (bus: Bus) => void
  removeBus: (busId: string) => void
  addRoute: (route: Route) => void
  removeRoute: (routeId: string) => void
}

export const useBusStore = create<BusState>((set) => ({
  // Dynamic Campus Settings
  campusName: "CampusFlow AI",
  setCampusName: (name) => set({ campusName: name }),
  addBus: (bus) => set((state) => ({ buses: [...state.buses, bus] })),
  removeBus: (busId) => set((state) => ({ buses: state.buses.filter((b) => b.busId !== busId) })),
  addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
  removeRoute: (routeId) => set((state) => {
    const remainingRoutes = state.routes.filter((r) => r.id !== routeId)
    const firstRoute = remainingRoutes[0]
    
    // Automatically reassign buses on the deleted route to the first available remaining route
    const updatedBuses = state.buses.map((bus) => {
      if (bus.routeId === routeId && firstRoute) {
        return {
          ...bus,
          routeId: firstRoute.id,
          route: `${firstRoute.name} (Line ${firstRoute.name.charAt(0)})`,
          lat: firstRoute.path[0][0],
          lng: firstRoute.path[0][1],
          currentPathIndex: 0,
          nextStop: firstRoute.stops[0]?.name || "Terminal",
        }
      }
      return bus
    }).filter((bus) => bus.routeId !== routeId || firstRoute)

    return {
      routes: remainingRoutes,
      buses: updatedBuses,
    }
  }),

  // Authentication & Default Roles
  activeRole: "admin",
  setActiveRole: (role) => set({ activeRole: role }),

  selectedBusId: "BUS-104",
  searchQuery: "",
  selectedRouteFilter: "all",

  isSimulating: true,
  simSpeed: 1,

  // Smart Safety Settings
  sosTriggered: false,
  setSosTriggered: (triggered) => set({ sosTriggered: triggered }),
  voiceEnabled: false,
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  heatmapEnabled: false,
  setHeatmapEnabled: (enabled) => set({ heatmapEnabled: enabled }),
  driverCompletedStops: [],
  toggleDriverStop: (stopName) =>
    set((state) => ({
      driverCompletedStops: state.driverCompletedStops.includes(stopName)
        ? state.driverCompletedStops.filter((s) => s !== stopName)
        : [...state.driverCompletedStops, stopName],
    })),

  // Demo Students Attendance NFC/RFID Log
  attendanceLogs: [
    {
      id: "log-1",
      studentName: "Aditya Verma",
      rollNumber: "IIT2023042",
      busId: "BUS-104",
      stopName: "Gachibowli DLF",
      timestamp: "11:15 AM",
      type: "RFID Tap",
    },
    {
      id: "log-2",
      studentName: "Sneha Reddy",
      rollNumber: "IIT2023118",
      busId: "BUS-202",
      stopName: "Lakdikapul",
      timestamp: "11:19 AM",
      type: "NFC Detect",
    },
  ],
  addAttendanceLog: (log) =>
    set((state) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const newLog: StudentAttendance = {
        ...log,
        id: `log-${Date.now()}`,
        timestamp: timeStr,
      }
      return { attendanceLogs: [newLog, ...state.attendanceLogs].slice(0, 50) }
    }),

  // Demo Buses Setup (5 buses for massive hacker/presentation visual impact)
  buses: [
    {
      busId: "BUS-104",
      routeId: "route-hitech",
      route: "Hitech City Express (Line H)",
      lat: 17.4483,
      lng: 78.3741,
      heading: 90,
      speed: 45,
      capacity: 60,
      passengers: 34,
      fuelLevel: 82,
      status: "on-time",
      nextStop: "Gachibowli DLF",
      etaMinutes: 2,
      driver: { name: "Ramesh Kumar", avatar: "👨‍✈️", rating: 4.8, phone: "+91 98480 22338" },
      currentPathIndex: 0,
    },
    {
      busId: "BUS-202",
      routeId: "route-charminar",
      route: "Charminar Heritage (Line C)",
      lat: 17.3616,
      lng: 78.4747,
      heading: 180,
      speed: 12,
      capacity: 55,
      passengers: 52,
      fuelLevel: 94,
      status: "heavy-traffic",
      nextStop: "Charminar Palace",
      etaMinutes: 4,
      driver: { name: "Suresh Yadav", avatar: "👨‍✈️", rating: 4.6, phone: "+91 91770 44551" },
      currentPathIndex: 0,
    },
    {
      busId: "BUS-500",
      routeId: "route-orr",
      route: "Outer Ring Commuter (Line O)",
      lat: 17.4241,
      lng: 78.3430,
      heading: 270,
      speed: 68,
      capacity: 70,
      passengers: 21,
      fuelLevel: 68,
      status: "on-time",
      nextStop: "Gachibowli Circle",
      etaMinutes: 5,
      driver: { name: "Baldev Singh", avatar: "👨‍✈️", rating: 4.9, phone: "+91 99882 11002" },
      currentPathIndex: 0,
    },
    {
      busId: "BUS-112",
      routeId: "route-hitech",
      route: "Hitech City Express (Line H)",
      lat: 17.4374,
      lng: 78.4116,
      heading: 45,
      speed: 40,
      capacity: 60,
      passengers: 12,
      fuelLevel: 42,
      status: "on-time",
      nextStop: "Jubilee Hills Checkpost",
      etaMinutes: 8,
      driver: { name: "M. A. Rahman", avatar: "👨‍✈️", rating: 4.7, phone: "+91 94405 88992" },
      currentPathIndex: 12,
    },
    {
      busId: "BUS-305",
      routeId: "route-charminar",
      route: "Charminar Heritage (Line C)",
      lat: 17.3820,
      lng: 78.4520,
      heading: 0,
      speed: 0,
      capacity: 55,
      passengers: 41,
      fuelLevel: 15,
      status: "delayed",
      nextStop: "Lakdikapul",
      etaMinutes: 12,
      driver: { name: "Koteswar Rao", avatar: "👨‍✈️", rating: 4.5, phone: "+91 96112 33445" },
      currentPathIndex: 5,
    },
  ],

  // Hyderabad landmark Routes & complete smooth Snap Road paths
  routes: [
    {
      id: "route-hitech",
      name: "Hitech City Express",
      color: "#00f0ff",
      stops: [
        { name: "Gachibowli DLF", lat: 17.4430, lng: 78.3570 },
        { name: "Hitech City Hub", lat: 17.4483, lng: 78.3741 },
        { name: "Jubilee Hills Checkpost", lat: 17.4348, lng: 78.4115 },
        { name: "Begumpet Station", lat: 17.4374, lng: 78.4482 },
        { name: "Secunderabad Junction", lat: 17.4338, lng: 78.5016 },
      ],
      path: [
        [17.4430, 78.3570],
        [17.4445, 78.3620],
        [17.4460, 78.3680],
        [17.4483, 78.3741],
        [17.4440, 78.3840],
        [17.4380, 78.3970],
        [17.4348, 78.4115],
        [17.4360, 78.4250],
        [17.4374, 78.4482],
        [17.4350, 78.4750],
        [17.4338, 78.5016],
      ],
    },
    {
      id: "route-charminar",
      name: "Charminar Heritage Line",
      color: "#bd34fe",
      stops: [
        { name: "Charminar Palace", lat: 17.3616, lng: 78.4747 },
        { name: "Koti Center", lat: 17.3820, lng: 78.4850 },
        { name: "Nampally Metro", lat: 17.3888, lng: 78.4680 },
        { name: "Lakdikapul", lat: 17.4010, lng: 78.4600 },
        { name: "Ameerpet Station", lat: 17.4374, lng: 78.4482 },
      ],
      path: [
        [17.3616, 78.4747],
        [17.3710, 78.4790],
        [17.3820, 78.4850],
        [17.3850, 78.4760],
        [17.3888, 78.4680],
        [17.3950, 78.4640],
        [17.4010, 78.4600],
        [17.4150, 78.4550],
        [17.4280, 78.4510],
        [17.4374, 78.4482],
      ],
    },
    {
      id: "route-orr",
      name: "Outer Ring Commuter",
      color: "#10b981",
      stops: [
        { name: "Gachibowli Circle", lat: 17.4241, lng: 78.3430 },
        { name: "Miyapur Metro", lat: 17.4968, lng: 78.3580 },
        { name: "Kukatpally Junction", lat: 17.4840, lng: 78.3980 },
        { name: "Secunderabad Metro", lat: 17.4338, lng: 78.5016 },
      ],
      path: [
        [17.4241, 78.3430],
        [17.4520, 78.3410],
        [17.4750, 78.3450],
        [17.4968, 78.3580],
        [17.4910, 78.3750],
        [17.4840, 78.3980],
        [17.4620, 78.4350],
        [17.4420, 78.4720],
        [17.4338, 78.5016],
      ],
    },
  ],

  setSelectedBusId: (id) => set({ selectedBusId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRouteFilter: (routeId) => set({ selectedRouteFilter: routeId }),
  setSimulating: (sim) => set({ isSimulating: sim }),
  setSimSpeed: (speed) => set({ simSpeed: speed }),

  updateBusPositions: (updater) =>
    set((state) => ({ buses: updater(state.buses) })),

  // Notifications Stack
  notifications: [
    {
      id: "1",
      message: "Security status operational. Campus telematics online.",
      severity: "success",
      timestamp: "11:20 AM",
    },
  ],

  addNotification: (message, severity = "info", busId) =>
    set((state) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const newNotif: NotificationLog = {
        id: `notif-${Date.now()}`,
        message,
        severity,
        timestamp: timeStr,
        busId,
      }
      return { notifications: [newNotif, ...state.notifications].slice(0, 100) }
    }),

  clearNotifications: () => set({ notifications: [] }),
}))
