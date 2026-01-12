"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function NewLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Login successful, redirect to dashboard or home
        router.push("/ex3")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Skip Supabase auth for demo - directly redirect to add-product
      // Store demo flag in sessionStorage to identify demo user
      sessionStorage.setItem('demo_user', 'true')
      
      // Direct redirect to add-product page
      router.push("/add-product")
    } catch (err) {
      setError("Demo girişi sırasında bir hata oluştu. Lütfen tekrar deneyin.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-1/2 bg-white p-12 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          {/* Logo */}
          <Image
            src="/catalyst.svg"
            alt="Muffin Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          {/* Register Link */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <Link href="/register-new">
              <Button className="rounded-lg bg-orange-500 text-white border-orange-500 hover:bg-orange-600 h-9 px-4">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Login Form Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login to your account</h1>
              <p className="text-gray-600">Enter your details to login.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address*</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-lg border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password*</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-lg border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    Keep me logged in
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Demo Login Button */}
              <Button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 rounded-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Login with Demo Credentials
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                Demo: demo@muffin.com / demo123456
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel - Testimonial */}
      <div className="w-1/2 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-32 w-48 h-48 bg-white/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-32 w-56 h-56 bg-white/8 rounded-full blur-2xl"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Testimonial */}
          <div className="max-w-md text-center">
            <p className="text-2xl font-bold mb-6 leading-relaxed">
              "Muffin has transformed our hiring process. We found the perfect candidates in half the time. The AI-powered matching is incredibly accurate."
            </p>
            <div className="mb-2">
              <p className="text-lg font-semibold">Sarah Chen</p>
            </div>
            <p className="text-sm text-white/90">Head of Talent / TechCorp</p>
          </div>

          {/* Carousel dots */}
          <div className="absolute bottom-12 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
