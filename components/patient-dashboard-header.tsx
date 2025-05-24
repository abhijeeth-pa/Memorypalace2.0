"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, LogOut, User, ChevronDown, Home } from "lucide-react"
import type { User as UserType } from "@/lib/types"

interface PatientDashboardHeaderProps {
  user: UserType
  onLogout: () => void
}

export function PatientDashboardHeader({ user, onLogout }: PatientDashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 px-6 lg:px-8 h-20 flex items-center border-b bg-white dark:bg-gray-900 shadow-sm">
      <Link className="flex items-center gap-2 font-semibold" href="/">
        <Brain className="h-8 w-8 text-purple-600" />
        <span className="text-xl font-bold">Memory Palace</span>
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="lg" className="text-lg hidden md:flex">
          <Home className="h-5 w-5 mr-2" />
          <span>Home</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-10 pl-2 pr-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-base font-medium hidden sm:inline-block">{user.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
