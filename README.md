# Real-Time Intelligent Transit Intelligence Platform
### Enterprise-Grade Fleet Telematics Tracking Dashboard

A premium, portfolio-worthy real-time bus tracking and dispatch intelligence dashboard. Designed around a modern cyber-dark aesthetic, this platform handles smooth geographic mapping, telemetry analytics, dynamic ETA calculations, and active dispatcher alerts.

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (Glassmorphism 2.0 theme) |
| **State** | Zustand (Reactive client-side stores) |
| **Animations** | Framer Motion (Fluid layout transitions & alerts) |
| **Map Engine** | Leaflet.js / Mapbox GL JS (Premium Dark Tile overlay) |
| **Charts** | Recharts (Responsive area and bar charts) |
| **Backend** | Supabase ready (PostgreSQL & Realtime sockets) |
| **Hosting** | Vercel (Auto cloud-build pipeline) |

---

## 🗺️ Real Geographic Simulator (Hyderabad, India)

To simulate authentic telematics data, the dashboard features real geographic coordinates and landmarks from **Hyderabad, India**:

1. **Hitech City Express (H-104)**: Gachibowli DLF ➔ Hitech City Hub ➔ Jubilee Hills Checkpost ➔ Begumpet ➔ Secunderabad Junction.
2. **Charminar Heritage Line (C-202)**: Charminar Palace ➔ Koti Center ➔ Nampally Metro ➔ Lakdikapul ➔ Ameerpet Station.
3. **Outer Ring Commuter (O-500)**: Gachibowli Circle ➔ Miyapur Metro ➔ Kukatpally Junction ➔ Secunderabad Metro.

### 🧠 Intelligent GPS Telemetry Calculations
Instead of simple timers, the simulator calculates values dynamically every 1.5 seconds:
*   **Vector Bearings:** Mathematical bearing angles are computed between successive points on roads to rotate the map bus markers precisely in the direction of physical travel.
*   **Approaching Stop Deceleration:** Speeds decrease dynamically as vehicles approach stops, holding them at 0 km/h during boarding cycles before accelerating.
*   **Interactive Passenger Exchanges:** Randomized passengers alight and board at each stop, visually updating occupancy progress lines.
*   **Telemetry Drainage:** Fuel/battery levels slowly deplete relative to speeds, triggering automatic alert warnings and autonomous refuel events.

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Server
```bash
npm run dev
```

### 3. Build Production Bundle
```bash
npm run build
```

---

## ☁️ Deployment Pipeline (Vercel & GitHub)

This application is fully prepped for Vercel's Zero-Config auto-build integration:
1. Push this folder to a new repository on your GitHub account (`gvssnuhith-person`).
2. Log into your **[Vercel Dashboard](https://vercel.com/gvssnuhith-persons-projects)**.
3. Click **Add New** ➔ **Project** ➔ **Import** the `bus-tracker` repository.
4. Click **Deploy**. Vercel will trigger the TypeScript Next.js build in the cloud and return your live production URL instantly!
