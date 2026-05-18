"use client"

import { useState, useEffect } from "react"
import { useBusStore, UserRole } from "@/store/busStore"

export default function LoginPortal() {
  const { login, campuses, routes } = useBusStore()

  // Screen state
  const [showLogin, setShowLogin] = useState(false)

  // Auth fields
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [authMethod, setAuthMethod] = useState<"email" | "otp">("email")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  
  // OTP Sim states
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)

  // Forgot Password Sim
  const [forgotActive, setForgotActive] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  // Live stats counters
  const [commuterCount, setCommuterCount] = useState(118)
  const [activeBuses, setActiveBuses] = useState(4)

  useEffect(() => {
    // Subtle count fluctuations to show "live en-route telemetry statistics"
    const interval = setInterval(() => {
      setCommuterCount((prev) => prev + Math.floor(Math.random() * 5) - 2)
      if (Math.random() > 0.8) {
        setActiveBuses((prev) => (prev === 4 ? 5 : 4))
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [otpTimer])

  const handleSendOtp = () => {
    if (!phone.trim()) return
    setOtpSent(true)
    setOtpTimer(60)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger Zustand log-in
    login(email || `${selectedRole}@campusflow.edu`, selectedRole)
  }

  const rolesList: { id: UserRole; label: string; desc: string; icon: string; defaultEmail: string }[] = [
    { id: "student", label: "Student Hub", desc: "Digital Ticket Pass & AI Hub", icon: "🎓", defaultEmail: "siddharth.sen@campusflow.edu" },
    { id: "parent", label: "Parent Safety", desc: "RFID Check-ins & Safe Maps", icon: "🏡", defaultEmail: "aditya.parent@campusflow.edu" },
    { id: "driver", label: "Driver Tablet", desc: "Milestones & Scanner SOS", icon: "🚍", defaultEmail: "driver.ramesh@campusflow.edu" },
    { id: "admin", label: "System Admin", desc: "Realtime Fleet Command Room", icon: "🛡️", defaultEmail: "admin.hq@campusflow.edu" },
    { id: "manager", label: "Transport Head", desc: "Depots, CRUD & PDF Analytics", icon: "💼", defaultEmail: "director.rao@campusflow.edu" },
    { id: "security", label: "Security Guard", desc: "Live SOS & CCTV Feeds", icon: "🚨", defaultEmail: "guard.singh@campusflow.edu" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* Background neon glows */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-[150px] pointer-events-none"></div>

      {/* Header bar */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-10 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase">
              CampusFlow AI
            </h1>
            <p className="text-[9px] font-bold text-slate-500 tracking-wider">
              Smart Campus Transit Ecosystem
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowLogin(true)
            setForgotActive(false)
          }}
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/10 active:scale-95 transition-all"
        >
          Console Login
        </button>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 z-10 relative">
        
        {!showLogin ? (
          /* ==================== SCREEN A: LANDING PAGE ==================== */
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                Production Grade AI Dispatch active
              </div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white">
                Next-Gen Campus <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Transit Intelligence
                </span>
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xl">
                A startup-quality smart transit ecosystem built on Firebase & Next.js. Integrates dynamic student boarding ticketing, safe parent RFID check-ins, automated driver SOS broadcasting, and AI ETA predictions.
              </p>

              {/* Real-time Counter Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
                <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-900/20 text-center lg:text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">ACTIVE BUSES</span>
                  <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight mt-1 block">
                    0{activeBuses} <span className="text-[10px] text-slate-500 font-sans">/ 05</span>
                  </span>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-900/20 text-center lg:text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">ONBOARD TODAY</span>
                  <span className="text-2xl font-black font-mono text-purple-400 tracking-tight mt-1 block">
                    {commuterCount}
                  </span>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-900/20 text-center lg:text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">FLEET STATUS</span>
                  <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight mt-1 block">
                    100%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    setShowLogin(true)
                    setSelectedRole("student")
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition-all"
                >
                  🎓 Student Pass
                </button>
                <button
                  onClick={() => {
                    setShowLogin(true)
                    setSelectedRole("admin")
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30 active:scale-95 transition-all"
                >
                  🛡️ Admin Console
                </button>
              </div>
            </div>

            {/* Right Column: Animated Cards & Features */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Feature 1 */}
              <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 hover:bg-white/2 transition-all group flex items-start gap-4">
                <span className="text-2xl p-2 rounded-lg bg-cyan-500/10">📍</span>
                <div>
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Live Route Map Tracking</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Dynamic Leaflet Dark Map overlay displaying accurate vector paths, overspeed indicators, and live coordinates.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-purple-500/30 hover:bg-white/2 transition-all group flex items-start gap-4">
                <span className="text-2xl p-2 rounded-lg bg-purple-500/10">💳</span>
                <div>
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">Automated NFC/RFID Attendance</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">QR tickets scan and driver NFC tablet simulation logs boarding details. Automatically sends notification alerts to parents.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 hover:bg-white/2 transition-all group flex items-start gap-4">
                <span className="text-2xl p-2 rounded-lg bg-emerald-500/10">🌦️</span>
                <div>
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">EV Battery & Climate Monitors</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Real-time tracking of EV shuttle charges, mileage, rain alerts, and tyre pressure telematics.</p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* ==================== SCREEN B: MULTI-ROLE LOGIN PORTAL ==================== */
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Role Selector Cards */}
            <div className="md:col-span-5 space-y-2 max-h-[480px] overflow-y-auto pr-1 no-scrollbar border-r border-white/5">
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase block mb-3 pl-1">
                Select Console Role
              </span>
              {rolesList.map((role) => {
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id)
                      setEmail(role.defaultEmail)
                      setForgotActive(false)
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-400/30 shadow-inner scale-[1.02]"
                        : "border-white/5 bg-slate-900/10 hover:border-white/10 hover:bg-white/2"
                    }`}
                  >
                    <span className="text-xl">{role.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black block tracking-wider uppercase text-slate-200 leading-none">
                        {role.label}
                      </span>
                      <span className="text-[8px] font-bold text-slate-500 block truncate mt-1">
                        {role.desc}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right Column: Dynamic Form Panel */}
            <div className="md:col-span-7 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative">
              
              {/* Back to landing link */}
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest flex items-center gap-1"
              >
                ← Back to Home
              </button>

              {!forgotActive ? (
                /* 1. Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4 my-auto">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                      <span>{rolesList.find((r) => r.id === selectedRole)?.icon}</span>
                      <span>{rolesList.find((r) => r.id === selectedRole)?.label}</span>
                    </h3>
                    <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                      Enter credentials for role validation
                    </p>
                  </div>

                  {/* Auth Switch Tabs (Email vs Mobile OTP) */}
                  <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-white/5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAuthMethod("email")}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                        authMethod === "email"
                          ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          : "text-slate-500"
                      }`}
                    >
                      Email Auth
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod("otp")}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                        authMethod === "otp"
                          ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          : "text-slate-500"
                      }`}
                    >
                      Mobile OTP
                    </button>
                  </div>

                  {authMethod === "email" ? (
                    /* Email Login fields */
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Campus Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@campusflow.edu"
                          className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[8px] font-bold text-slate-400 uppercase">Password</label>
                          <button
                            type="button"
                            onClick={() => {
                              setForgotActive(true)
                              setForgotSent(false)
                            }}
                            className="text-[8px] font-bold text-cyan-400 hover:underline uppercase"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    /* OTP Login fields */
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Registered Mobile No.</label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="+91 99999 88888"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                            required={authMethod === "otp"}
                          />
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpTimer > 0}
                            className="px-3 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[9px] font-black uppercase disabled:text-slate-500 active:scale-95 transition-all"
                          >
                            {otpTimer > 0 ? `Resend (${otpTimer}s)` : "Send OTP"}
                          </button>
                        </div>
                      </div>

                      {otpSent && (
                        <div className="space-y-1 animate-fadeIn">
                          <label className="text-[8px] font-bold text-slate-400 uppercase">Enter 6-Digit OTP</label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full glass-input text-center text-xs tracking-widest px-3 py-2 rounded-lg font-bold font-mono"
                            required={authMethod === "otp"}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profile face-scanner simulation */}
                  <div className="p-3 rounded-xl border border-white/5 bg-slate-950/40 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-sm shadow-inner cursor-pointer relative group">
                      👤
                      <div className="absolute inset-0 border border-cyan-400 rounded-lg animate-pulse pointer-events-none"></div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-cyan-400 tracking-wider block uppercase">Profile Photo Verification</span>
                      <p className="text-[7px] font-bold text-slate-500">Live Face Recognition simulation active</p>
                    </div>
                  </div>

                  {/* Submit and Checkboxes */}
                  <div className="flex justify-between items-center pt-2">
                    <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-500 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-cyan-400" />
                      Remember Me
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg active:scale-95 transition-all"
                    >
                      Authenticate console
                    </button>
                  </div>

                </form>
              ) : (
                /* 2. Forgot Password Sim Form */
                <div className="space-y-4 my-auto">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-white uppercase">Reset Passkey</h3>
                    <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-1">
                      Enter email for secure verification link
                    </p>
                  </div>

                  {!forgotSent ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Campus Email</label>
                        <input
                          type="email"
                          placeholder="name@campusflow.edu"
                          className="w-full glass-input text-[10px] px-3 py-2 rounded-lg font-bold"
                          required
                        />
                      </div>
                      <button
                        onClick={() => setForgotSent(true)}
                        className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition-all"
                      >
                        Send Reset Link
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                      <span className="text-xl block">✉️</span>
                      <h4 className="text-xs font-black text-emerald-400 uppercase">Verification Sent</h4>
                      <p className="text-[8px] text-slate-500 font-semibold leading-relaxed">
                        Secure passcode link has been dispatched to your mailbox. Follow instructions to authenticate.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setForgotActive(false)}
                    className="w-full text-center text-[8px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest"
                  >
                    ← Back to Login
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Footer covers */}
      <footer className="w-full px-6 py-3 border-t border-white/5 bg-slate-950/40 text-center z-10 shrink-0">
        <p className="text-[8px] font-bold text-slate-600 tracking-widest uppercase">
          CampusFlow AI Transit Ecosystem © 2026 • Firebase + Next.js Production Suite
        </p>
      </footer>

    </div>
  )
}
