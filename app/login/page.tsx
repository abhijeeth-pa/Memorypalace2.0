"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For the prototype, we'll just check localStorage
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const user = JSON.parse(storedUser)

      if (user.email === formData.email && user.password === formData.password) {
        toast({
          title: "Login successful!",
          description: "Welcome back to Memory Palace 2.0",
        })

        // Redirect based on user type
        if (user.userType === "family") {
          router.push("/dashboard/family")
        } else {
          router.push("/dashboard/patient")
        }
        return
      }
    }

    // For demo purposes, allow login with any credentials
    toast({
      title: "Demo mode",
      description: "Logging in with demo account",
    })

    // Default to family dashboard for demo
    router.push("/dashboard/family")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Brain className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-semibold">Memory Palace 2.0</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Login
            </Button>
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline text-purple-600">
              Register
            </Link>
          </div>
          <div className="text-center text-xs text-gray-500">
            <Button
              variant="link"
              className="text-xs p-0 h-auto text-gray-500"
              onClick={() => {
                toast({
                  title: "Demo mode",
                  description: "Logging in with demo account",
                })
                router.push("/dashboard/family")
              }}
            >
              Try demo (family view)
            </Button>
            {" | "}
            <Button
              variant="link"
              className="text-xs p-0 h-auto text-gray-500"
              onClick={() => {
                toast({
                  title: "Demo mode",
                  description: "Logging in with patient demo account",
                })
                router.push("/dashboard/patient")
              }}
            >
              Try demo (patient view)
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
