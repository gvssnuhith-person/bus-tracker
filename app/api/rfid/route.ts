import { NextResponse } from "next/server"

// In a real implementation, you would import firebaseAdmin here
// import { db } from "@/lib/firebaseAdmin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentName, rollNumber, busId, stopName, type } = body

    if (!rollNumber || !busId) {
      return NextResponse.json(
        { error: "Missing required fields: rollNumber, busId" },
        { status: 400 }
      )
    }

    const logEntry = {
      id: `hw-log-${Date.now()}`,
      studentName: studentName || "Unknown Student",
      rollNumber: rollNumber.toUpperCase(),
      busId,
      stopName: stopName || "En-route",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: type || "RFID Tap",
      source: "hardware_reader"
    }

    // FUTURE FIREBASE INTEGRATION:
    // await db.collection("attendanceLogs").doc(logEntry.id).set(logEntry)

    console.log(`[HARDWARE API] Received RFID Scan: ${logEntry.rollNumber} at ${logEntry.stopName}`)

    return NextResponse.json(
      { success: true, message: "RFID scan recorded successfully", data: logEntry },
      { status: 201 }
    )
  } catch (error) {
    console.error("[HARDWARE API] Error processing RFID scan:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
