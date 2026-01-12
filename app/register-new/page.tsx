"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Zap, Users, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function RegisterNewPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Register user with Supabase (email confirmation disabled)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          // Disable email confirmation - user will be auto-confirmed
          emailRedirectTo: undefined,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Send welcome email via our API route
        try {
          const response = await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.user.email,
              name: name,
            }),
          })

          if (response.ok) {
            console.log('Welcome email sent successfully')
          }
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError)
          // Don't block registration if email fails
        }

        setSuccess(true)
        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          router.push("/add-product")
        }, 1500)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
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
          {/* Login Link */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Link href="/new-login">
              <Button className="rounded-lg bg-orange-500 text-white border-orange-500 hover:bg-orange-600 h-9 px-4">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Login Form Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Enter your details to register.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name*</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 rounded-lg border-gray-300"
                    required
                  />
                </div>
              </div>

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

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600">Account created successfully! Redirecting...</p>
                </div>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full h-12 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : success ? "Account Created!" : "Register"}
              </Button>
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

          {/* Features */}
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-8 leading-tight">
              Why Choose Muffin?
            </h2>
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">AI-Powered Matching</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Find the perfect candidates with intelligent AI that analyzes skills, experience, and cultural fit.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Streamlined Pipeline</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Manage your entire hiring process from sourcing to onboarding in one unified platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Time-Saving Automation</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Automate repetitive tasks and focus on what matters most - building great teams.
                  </p>
                </div>
              </div>
            </div>
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
