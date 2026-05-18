import { create } from "zustand"

export type UserRole = "admin" | "student" | "parent" | "driver" | "manager" | "security"

export interface DriverInfo {
  name: string
  avatar: string
  rating: number
  phone: string
  licenseNumber?: string
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
  fuelLevel: number // EV Battery %
  status: "on-time" | "heavy-traffic" | "delayed" | "maintenance" | "offline"
  nextStop: string
  etaMinutes: number
  driver: DriverInfo
  currentPathIndex: number
  
  // High-fidelity ecosystem metrics
  evBatteryCharge: number
  mileage: number
  tirePressure: string
  engineAlerts: string
  cctvActive: boolean
  weatherWarning: string
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
  timings?: string
}

export interface Campus {
  id: string
  name: string
  address: string
  phone: string
  transportHead: string
  logo: string
  lat: number
  lng: number
}

export interface NotificationLog {
  id: string
  message: string
  severity: "info" | "success" | "warning" | "error"
  timestamp: string
  busId?: string
}

export interface Announcement {
  id: string
  message: string
  type: "holiday" | "route" | "emergency"
  timestamp: string
}

interface BusState {
  // Authentication & Dynamic Session
  loggedInUser: { email: string; role: UserRole; name: string; avatar?: string } | null
  login: (email: string, role: UserRole) => void
  logout: () => void
  activeRole: UserRole
  setActiveRole: (role: UserRole) => void

  // Core Campus details
  campusName: string
  setCampusName: (name: string) => void
  campuses: Campus[]
  addCampus: (campus: Campus) => void
  removeCampus: (id: string) => void

  // Telemetry Lists
  buses: Bus[]
  routes: Route[]
  selectedBusId: string | null
  setSelectedBusId: (id: string | null) => void

  // Filters & Universal Smart Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedRouteFilter: string
  setSelectedRouteFilter: (routeId: string) => void

  // Global Theme Mode
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void

  // Real-Time Simulator Variables
  isSimulating: boolean
  setSimulating: (sim: boolean) => void
  simSpeed: number
  setSimSpeed: (speed: number) => void
  updateBusPositions: (updater: (prev: Bus[]) => Bus[]) => void

  // Announcement Engine
  announcements: Announcement[]
  addAnnouncement: (message: string, type: "holiday" | "route" | "emergency") => void

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
  addBus: (bus: Bus) => void
  removeBus: (busId: string) => void
  updateBus: (busId: string, updated: Partial<Bus>) => void
  addRoute: (route: Route) => void
  removeRoute: (routeId: string) => void
  updateRoute: (routeId: string, updated: Partial<Route>) => void
  updateCampus: (id: string, updated: Partial<Campus>) => void
  removeAttendanceLog: (id: string) => void
  updateAttendanceLog: (id: string, updated: Partial<StudentAttendance>) => void
  fetchRealRoadPath: (routeId: string) => Promise<void>
}

export const useBusStore = create<BusState>((set, get) => ({
  // Authentication & Dynamic Session defaults
  loggedInUser: null, // Start logged out so landing page & login portal are visible!
  login: (email, role) => set({
    loggedInUser: {
      email,
      role,
      name: role === "student" 
        ? "Siddharth Sen" 
        : role === "parent" 
        ? "Aditya's Parent" 
        : role === "driver" 
        ? "Ramesh Kumar" 
        : role === "manager" 
        ? "Director Rao" 
        : role === "security" 
        ? "Officer Singh" 
        : "System Admin",
      avatar: "👨‍💻",
    },
    activeRole: role,
  }),
  logout: () => set({ loggedInUser: null, activeRole: "admin" }),
  activeRole: "admin",
  setActiveRole: (role) => set({ activeRole: role }),

  // Global Theme
  theme: "dark",
  setTheme: (theme) => set({ theme }),

  // Dynamic Campus Settings
  campusName: "Vantage Tech Campus",
  setCampusName: (name) => set({ campusName: name }),
  campuses: [
    {
      id: "campus-main",
      name: "Vantage Tech Campus",
      address: "DLF Road, Gachibowli, Hyderabad, TS",
      phone: "+91 40 2300 1234",
      transportHead: "Director Ramesh Rao",
      logo: "🏫",
      lat: 17.4430,
      lng: 78.3570,
    },
    {
      id: "campus-city",
      name: "Charminar Heritage Depot",
      address: "Pathergatti Road, Charminar, Hyderabad, TS",
      phone: "+91 40 2450 5678",
      transportHead: "Asst. Suptd. Yadav",
      logo: "🕌",
      lat: 17.3616,
      lng: 78.4747,
    },
    {
      id: "campus-iith",
      name: "IIT Hyderabad Depot",
      address: "NH 65, Kandi, Sangareddy, Telangana",
      phone: "+91 40 2301 6033",
      transportHead: "Prof. B. S. Murty",
      logo: "🏢",
      lat: 17.5947,
      lng: 78.1232,
    },
    {
      id: "campus-nitw",
      name: "NIT Warangal Depot",
      address: "Fathimanagar, Warangal, Telangana",
      phone: "+91 870 245 9191",
      transportHead: "Director Bidyadhar Subudhi",
      logo: "🏛️",
      lat: 17.9784,
      lng: 79.6016,
    },
    {
      id: "campus-basar",
      name: "RGUKT Basar Depot",
      address: "Basar, Mudhole, Nirmal, Telangana",
      phone: "+91 87522 43344",
      transportHead: "Dr. Venkata Ramana",
      logo: "🏫",
      lat: 18.8770,
      lng: 77.9048,
    },
    {
      id: "campus-ou",
      name: "Osmania University Depot",
      address: "Amberpet, Hyderabad, Telangana",
      phone: "+91 40 2768 2444",
      transportHead: "Prof. Dandaboina Ravinder",
      logo: "🏛️",
      lat: 17.4137,
      lng: 78.5280,
    },
    {
      id: "campus-jntuh",
      name: "JNTU Kukatpally Depot",
      address: "Kukatpally, Hyderabad, Telangana",
      phone: "+91 40 2315 8661",
      transportHead: "Director K. Narasimha Reddy",
      logo: "🏢",
      lat: 17.5020,
      lng: 78.3872,
    },
    {
      id: "campus-vizag",
      name: "Andhra University Depot",
      address: "Waltair Junction, Visakhapatnam, AP",
      phone: "+91 891 284 4000",
      transportHead: "Vice Chancellor Prasad",
      logo: "🏫",
      lat: 17.7266,
      lng: 83.3244,
    },
    {
      id: "campus-jntuk",
      name: "JNTU Kakinada Depot",
      address: "Pithapuram Road, Kakinada, AP",
      phone: "+91 884 230 0900",
      transportHead: "Prof. G. V. R. Prasada Raju",
      logo: "🏢",
      lat: 16.9754,
      lng: 82.2425,
    },
    {
      id: "campus-srm",
      name: "SRM University AP Depot",
      address: "Neerukonda, Amaravati, AP",
      phone: "+91 863 234 3000",
      transportHead: "Prof. Manoj K. Arora",
      logo: "🏛️",
      lat: 16.4862,
      lng: 80.5050,
    },
    {
      id: "campus-vitap",
      name: "VIT AP Campus Depot",
      address: "Inavolu, Amaravati, AP",
      phone: "+91 863 237 0000",
      transportHead: "Dr. S. V. Kota Reddy",
      logo: "🏫",
      lat: 16.4962,
      lng: 80.4950,
    },
    {
      id: "campus-svu",
      name: "SV University Depot",
      address: "Tirupati Road, Tirupati, AP",
      phone: "+91 877 228 9545",
      transportHead: "Prof. K. Raja Reddy",
      logo: "🏛️",
      lat: 13.6276,
      lng: 79.4005,
    },
    {
      id: "campus-iitt",
      name: "IIT Tirupati Campus Depot",
      address: "Yerpedu - Venkatagiri Road, AP",
      phone: "+91 877 250 3000",
      transportHead: "Director K. N. Satyanarayana",
      logo: "🏢",
      lat: 13.6293,
      lng: 79.5794,
    },
    {
      id: "campus-jntua",
      name: "JNTU Anantapur Depot",
      address: "NH 44, Anantapur, AP",
      phone: "+91 8554 272433",
      transportHead: "Prof. G. Ranga Janardhana",
      logo: "🏢",
      lat: 14.6819,
      lng: 77.6006,
    },
    {
      id: "campus-anu",
      name: "Acharya Nagarjuna Depot",
      address: "NH 16, Nagarjuna Nagar, Guntur, AP",
      phone: "+91 863 234 6114",
      transportHead: "Prof. P. Rajasekhar",
      logo: "🏫",
      lat: 16.3773,
      lng: 80.5255,
    },
    {
      id: "campus-delhi",
      name: "Delhi North Campus Depot",
      address: "Chhatra Marg, GTB Nagar, New Delhi",
      phone: "+91 11 2766 7722",
      transportHead: "Superintendent Verma",
      logo: "🏛️",
      lat: 28.6921,
      lng: 77.2141,
    },
    {
      id: "campus-bangalore",
      name: "Bangalore Tech Depot",
      address: "Electronic City Phase I, Bangalore",
      phone: "+91 80 4110 9988",
      transportHead: "Admin Chief Murthy",
      logo: "🏢",
      lat: 12.9716,
      lng: 77.5946,
    },
  ],
  addCampus: (campus) => set((state) => ({ campuses: [...state.campuses, campus] })),
  removeCampus: (id) => set((state) => ({ campuses: state.campuses.filter((c) => c.id !== id) })),

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

  // Announcements Engine
  announcements: [
    {
      id: "ann-1",
      message: "Monsoon schedule active: Cruise speed limits enforced at 45km/h max.",
      type: "route",
      timestamp: "09:00 AM",
    },
    {
      id: "ann-2",
      message: "Security Alert Drill: Dispatch SOS beacons tested successfully.",
      type: "emergency",
      timestamp: "10:15 AM",
    },
  ],
  addAnnouncement: (message, type) =>
    set((state) => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        message,
        type,
        timestamp: timeStr,
      }
      return { announcements: [newAnn, ...state.announcements].slice(0, 50) }
    }),

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

  // Dynamic EV Buses Setup
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
      driver: { name: "Ramesh Kumar", avatar: "👨‍✈️", rating: 4.8, phone: "+91 98480 22338", licenseNumber: "DL-H104X20" },
      currentPathIndex: 0,
      evBatteryCharge: 82,
      mileage: 6.8,
      tirePressure: "Nominal (34 PSI)",
      engineAlerts: "No active faults",
      cctvActive: true,
      weatherWarning: "Wet road warning (Light Rain)",
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
      driver: { name: "Suresh Yadav", avatar: "👨‍✈️", rating: 4.6, phone: "+91 91770 44551", licenseNumber: "DL-C202Y18" },
      currentPathIndex: 0,
      evBatteryCharge: 94,
      mileage: 5.2,
      tirePressure: "Nominal (33 PSI)",
      engineAlerts: "Check coolant levels",
      cctvActive: true,
      weatherWarning: "Nominal en-route",
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
      driver: { name: "Baldev Singh", avatar: "👨‍✈️", rating: 4.9, phone: "+91 99882 11002", licenseNumber: "DL-O500Z15" },
      currentPathIndex: 0,
      evBatteryCharge: 68,
      mileage: 8.4,
      tirePressure: "Low pressure left rear (29 PSI)",
      engineAlerts: "No active faults",
      cctvActive: true,
      weatherWarning: "Nominal en-route",
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
      driver: { name: "M. A. Rahman", avatar: "👨‍✈️", rating: 4.7, phone: "+91 94405 88992", licenseNumber: "DL-H112A22" },
      currentPathIndex: 12,
      evBatteryCharge: 42,
      mileage: 7.1,
      tirePressure: "Nominal (35 PSI)",
      engineAlerts: "No active faults",
      cctvActive: true,
      weatherWarning: "Wet road warning (Light Rain)",
    },
  ],

  // landmark Routes
  routes: [
    {
      id: "route-hitech",
      name: "Hitech City Express",
      color: "#00f0ff",
      timings: "08:00 AM - 06:30 PM",
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
      timings: "08:30 AM - 07:00 PM",
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

  addBus: (bus) => set((state) => ({ buses: [...state.buses, bus] })),
  removeBus: (busId) => set((state) => ({ buses: state.buses.filter((b) => b.busId !== busId) })),
  updateBus: (busId, updated) => set((state) => ({
    buses: state.buses.map((b) => b.busId === busId ? { ...b, ...updated } : b)
  })),
  addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
  removeRoute: (routeId) => set((state) => {
    const remainingRoutes = state.routes.filter((r) => r.id !== routeId)
    const firstRoute = remainingRoutes[0]
    
    // Automatically reassign buses
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
  updateRoute: (routeId, updated) => set((state) => ({
    routes: state.routes.map((r) => r.id === routeId ? { ...r, ...updated } : r)
  })),
  updateCampus: (id, updated) => set((state) => ({
    campuses: state.campuses.map((c) => c.id === id ? { ...c, ...updated } : c)
  })),
  removeAttendanceLog: (id) => set((state) => ({
    attendanceLogs: state.attendanceLogs.filter((l) => l.id !== id)
  })),
  updateAttendanceLog: (id, updated) => set((state) => ({
    attendanceLogs: state.attendanceLogs.map((l) => l.id === id ? { ...l, ...updated } : l)
  })),

  // Phase 3: Dynamic Real-Road Routing Engine (OSRM)
  fetchRealRoadPath: async (routeId: string) => {
    const state = get()
    const route = state.routes.find((r) => r.id === routeId)
    if (!route || route.stops.length < 2) return

    try {
      // Create coordinates string: lon1,lat1;lon2,lat2;...
      const coordsString = route.stops.map(s => `${s.lng},${s.lat}`).join(';')
      
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
      const data = await response.json()

      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const geojsonPath = data.routes[0].geometry.coordinates // [lng, lat][]
        const newPath = geojsonPath.map((coord: number[]) => [coord[1], coord[0]] as [number, number]) // convert to [lat, lng]
        
        set((state) => ({
          routes: state.routes.map(r => r.id === routeId ? { ...r, path: newPath } : r)
        }))
        console.log(`[OSRM] Successfully fetched real road routing for ${route.name}`)
      }
    } catch (error) {
      console.error(`[OSRM] Failed to fetch route for ${routeId}`, error)
    }
  },
}))
