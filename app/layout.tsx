import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real-Time Intelligent Transit Intelligence Platform',
  description: 'Production-grade enterprise real-time fleet telematics tracking dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Leaflet CSS for map styling */}
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body className="antialiased min-h-screen bg-[#030308] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300">
        {children}
      </body>
    </html>
  )
}
