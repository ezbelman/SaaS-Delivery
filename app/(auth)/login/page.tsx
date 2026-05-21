"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState("slalom@slalom.com")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      router.push("/overview")
    } else {
      setError(result.error ?? "Login failed")
    }
  }

  return (
    <div className="w-full max-w-[420px] animate-fade-up">
      {/* Mobile logo — hidden on desktop (panel shows it) */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="h-9 w-9 rounded-lg bg-sdp-red flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>S</span>
        </div>
        <div>
          <p className="text-sm font-bold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>Slalom</p>
          <p className="text-xs text-ink-3">Delivery Platform</p>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold text-ink tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Sign in to your{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, opacity: 0.6 }}>workspace</em>
        </h2>
        <p className="text-sm text-ink-2 mt-1.5">
          Enterprise program governance & delivery management
        </p>
      </div>

      {/* Form card */}
      <div
        className="rounded-2xl border p-8 shadow-2xl"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--line)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@slalom.com"
            autoComplete="email"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="flex h-10 w-full rounded-lg border bg-elevated px-3.5 py-2 pr-10 text-sm text-ink placeholder:text-ink-3 transition-all focus:outline-none focus:border-sdp-red focus:ring-2 focus:ring-sdp-red/20"
                style={{ borderColor: 'var(--line)' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 rounded-lg bg-danger/10 border border-danger/20 px-3.5 py-2.5">
              <AlertCircle className="h-4 w-4 text-danger shrink-0" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-1 rounded-lg"
            loading={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {/* Slalom asterisk separator */}
        <div className="sdp-sep text-[9px] my-5" style={{ letterSpacing: '0.6em' }}>* * *</div>

        {/* Demo hint */}
        <div>
          <p className="text-[11px] text-ink-3 uppercase tracking-widest font-semibold mb-2">
            Demo credentials
          </p>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-ink-2 font-mono">slalom@slalom.com</p>
              <p className="text-xs text-ink-2 font-mono">slalom123</p>
            </div>
            <div className="sdp-gold-dot" />
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-ink-3 mt-6 tracking-wide">
        Slalom Delivery Platform · Enterprise Edition
      </p>
    </div>
  )
}
