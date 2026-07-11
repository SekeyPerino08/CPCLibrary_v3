"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, BookOpen, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(() => {
    return identifier.trim().length > 0 && password.length >= 1
  }, [identifier, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!canSubmit) {
      setError("Please enter your email/username and password.")
      return
    }

    setLoading(true)
    try {
      // Mock authentication for UI readiness.
      await new Promise((r) => setTimeout(r, 650))

      // Demo credentials (so the UI is fully functional end-to-end).
      // Accept anything by default, but keep a predictable "demo" option.
      const demoAccount = {
        username: "demo@cordova.edu",
        password: "demo1234",
      }

      const isDemo =
        identifier.trim().toLowerCase() === demoAccount.username.toLowerCase() &&
        password === demoAccount.password

      const payload = {
        identifier: identifier.trim(),
        rememberMe,
        at: new Date().toISOString(),
        isDemo,
      }

      localStorage.setItem("library_login_mock", JSON.stringify(payload))
      localStorage.setItem("library_auth_mock", JSON.stringify({ loggedIn: true, at: new Date().toISOString() }))

      // Redirect to dashboard (or next stage) once "logged in".
      window.location.href = "/"

    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: illustration / brand */}
        <section className="hidden lg:flex">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">Cordova Public College</div>
                    <div className="text-sm text-muted-foreground">Library Management System</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Welcome to Knowledge</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Sign in to manage books, track borrows, and keep your academic resources organized.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                  <ShieldCheck className="text-primary" size={18} />
                  <p className="text-sm font-medium">Secure access with modern authentication UI</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen size={16} />
                  </span>
                  <p className="text-sm font-medium">Minimal, professional design consistent with dashboards</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: login card */}
        <section className="flex justify-center">
          <Card className="w-full bg-card/90 backdrop-blur border border-border shadow-xs rounded-2xl overflow-hidden">
            <div className="p-7 sm:p-10">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {/* Replace with your real logo when available */}
                    <div className="w-7 h-7" aria-hidden>
                      <BookOpen className="text-primary" size={28} />
                    </div>
                  </div>
                </div>
              </div>


              <h1 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="mt-2 text-center text-muted-foreground">
                Sign in to the Library System to continue.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {/* Identifier */}
                <div className="space-y-2">
                  <Label htmlFor="identifier">ID Number</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="identifier"
                      name="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your ID Number (e.g., 2025-01234)"
                      autoComplete="username"
                      className="pl-10"
                    />
                  </div>
                </div>


                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-sm text-primary hover:underline"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <span className="inline-flex items-center gap-2">
                          <EyeOff size={16} /> Hide
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Eye size={16} /> Show
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pl-10 pr-10"
                    />
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
                    <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} />
                    Remember me
                  </label>

                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit || loading}
                  size="lg"
                  className="w-full mt-2"
                >
                  {loading ? "Logging in…" : "Login"}
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setError(null)
                      localStorage.setItem(
                        "library_login_mock",
                        JSON.stringify({ identifier: "guest", rememberMe: false, at: new Date().toISOString() }),
                      )
                      setPassword("")
                    }}
                  >
                    Login as Guest
                  </Button>
                </div>


                <p className="pt-2 text-center text-xs text-muted-foreground">
                  By continuing, you agree to the Library System terms.
                </p>
              </form>
            </div>

            <div className="px-7 sm:px-10 pb-6">
              <div className="mt-2 text-center text-xs text-muted-foreground">
                © 2026 Cordova Public College. All rights reserved.
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

