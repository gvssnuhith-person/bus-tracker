import { NextResponse } from "next/server"

// In a real implementation, you would import firebaseAdmin here
// import { db } from "@/lib/firebaseAdmin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { busId, lat, lng, speed, evBatteryCharge, status, passengers } = body

    if (!busId || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: busId, lat, lng" },
        { status: 400 }
      )
    }

    const telemetryUpdate = {
      lat,
      lng,
      speed: speed || 0,
      evBatteryCharge: evBatteryCharge || 100,
      status: status || "on-time",
      passengers: passengers || 0,
      lastUpdated: new Date().toISOString()
    }

    // FUTURE FIREBASE INTEGRATION:
    // await db.collection("buses").doc(busId).update(telemetryUpdate)

    console.log(`[HARDWARE API] Received Telemetry for ${busId}: [${lat}, ${lng}] at ${speed}km/h`)

    return NextResponse.json(
      { success: true, message: "Telemetry updated successfully", data: telemetryUpdate },
      { status: 200 }
    )
  } catch (error) {
    console.error("[HARDWARE API] Error processing telemetry:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
