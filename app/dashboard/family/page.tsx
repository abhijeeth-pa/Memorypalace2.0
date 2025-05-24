"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ImageIcon, Plus, Users, Settings, LogOut, TrendingUp, Gamepad2, Clock, Target } from "lucide-react"
import { UploadMemoryForm } from "@/components/upload-memory-form"
import { MemoryList } from "@/components/memory-list"
import { PatientProgressDashboard } from "@/components/patient-progress-dashboard"
import { mockMemories } from "@/lib/mock-data"
import type { Memory, PatientProgress, GameSession } from "@/lib/types"

export default function FamilyDashboard() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [patientProgress, setPatientProgress] = useState<PatientProgress | null>(null)
  const [gameSessions, setGameSessions] = useState<GameSession[]>([])

  useEffect(() => {
    // Load memories from localStorage or use mock data
    const storedMemories = localStorage.getItem("memories")
    if (storedMemories) {
      setMemories(JSON.parse(storedMemories))
    } else {
      setMemories(mockMemories)
      localStorage.setItem("memories", JSON.stringify(mockMemories))
    }

    // Load game sessions
    const storedSessions = localStorage.getItem("gameSessions")
    if (storedSessions) {
      setGameSessions(JSON.parse(storedSessions))
    } else {
      // Generate mock sessions
      const mockSessions: GameSession[] = [
        {
          id: "1",
          gameId: "memory-cards",
          userId: "patient-1",
          score: 85,
          maxScore: 100,
          timeSpent: 300,
          difficulty: "easy",
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          mistakes: 2,
        },
        {
          id: "2",
          gameId: "sequence-recall",
          userId: "patient-1",
          score: 72,
          maxScore: 100,
          timeSpent: 480,
          difficulty: "medium",
          completedAt: new Date(Date.now() - 172800000).toISOString(),
          mistakes: 4,
        },
        {
          id: "3",
          gameId: "face-name-match",
          userId: "patient-1",
          score: 90,
          maxScore: 100,
          timeSpent: 240,
          difficulty: "easy",
          completedAt: new Date(Date.now() - 259200000).toISOString(),
          mistakes: 1,
        },
      ]
      setGameSessions(mockSessions)
    }

    // Generate mock patient progress
    generateMockProgress()
  }, [])

  const generateMockProgress = () => {
    const mockProgress: PatientProgress = {
      userId: "patient-1",
      totalGamesPlayed: 45,
      totalTimeSpent: 2700, // 45 minutes
      averageScore: 78,
      improvementRate: 12,
      favoriteGameType: "matching",
      weeklyProgress: [
        { week: "Week 1", gamesPlayed: 8, averageScore: 65, timeSpent: 480 },
        { week: "Week 2", gamesPlayed: 12, averageScore: 72, timeSpent: 720 },
        { week: "Week 3", gamesPlayed: 15, averageScore: 78, timeSpent: 900 },
        { week: "Week 4", gamesPlayed: 10, averageScore: 82, timeSpent: 600 },
      ],
      gameTypeProgress: [
        { type: "matching", gamesPlayed: 20, averageScore: 85, bestScore: 95 },
        { type: "sequence", gamesPlayed: 15, averageScore: 72, bestScore: 88 },
        { type: "puzzle", gamesPlayed: 8, averageScore: 68, bestScore: 82 },
        { type: "word", gamesPlayed: 2, averageScore: 60, bestScore: 70 },
      ],
    }
    setPatientProgress(mockProgress)
  }

  const handleAddMemory = (memory: Memory) => {
    const updatedMemories = [...memories, memory]
    setMemories(updatedMemories)
    localStorage.setItem("memories", JSON.stringify(updatedMemories))
  }

  const handleLogout = () => {
    router.push("/")
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Brain className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-semibold">Memory Palace 2.0</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </nav>
      </header>
      <div className="flex flex-1">
        <aside className="w-16 md:w-64 border-r bg-gray-50 dark:bg-gray-900">
          <nav className="flex flex-col items-center md:items-start gap-4 p-4">
            <Link
              href="/dashboard/family"
              className="flex items-center gap-2 text-purple-600 font-medium rounded-lg px-3 py-2 bg-purple-50 dark:bg-purple-900/20 w-full justify-center md:justify-start"
            >
              <ImageIcon className="h-5 w-5" />
              <span className="hidden md:inline">Memories</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-center md:justify-start"
            >
              <Users className="h-5 w-5" />
              <span className="hidden md:inline">Family Members</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full justify-center md:justify-start"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden md:inline">Settings</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Family Dashboard</h1>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
            </div>

            <Tabs defaultValue="memories">
              <TabsList>
                <TabsTrigger value="memories">Memories</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
                <TabsTrigger value="progress">Patient Progress</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="memories" className="space-y-4 pt-4">
                <MemoryList memories={memories} isEditable={true} />
              </TabsContent>

              <TabsContent value="upload" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Memory</CardTitle>
                    <CardDescription>
                      Add photos, videos, or stories to help your loved one remember special moments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UploadMemoryForm onAddMemory={handleAddMemory} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4 pt-4">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Patient Progress Overview</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitor your loved one's engagement with memories and cognitive training games.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        Games This Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>+20% vs last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Average Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">82%</div>
                      <div className="text-xs text-gray-500 mt-1">Excellent progress!</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Spent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2h 15m</div>
                      <div className="text-xs text-gray-500 mt-1">This week</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Memory Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-xs text-gray-500 mt-1">Memories viewed this week</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest games and memory interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {gameSessions.slice(0, 5).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                              <Gamepad2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {session.gameId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(session.completedAt).toLocaleDateString()} • {formatTime(session.timeSpent)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${session.score >= 80 ? "text-green-600" : session.score >= 60 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {session.score}%
                            </div>
                            <div className="text-xs text-gray-500">{session.mistakes} mistakes</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Progress */}
                {patientProgress && (
                  <PatientProgressDashboard progress={patientProgress} recentSessions={gameSessions} />
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Memory Engagement</CardTitle>
                    <CardDescription>
                      Track how your loved one is engaging with the memories you've shared.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Quiz Performance</h3>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">75%</div>
                            <div className="text-sm text-gray-500">Correct Answers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">12</div>
                            <div className="text-sm text-gray-500">Quizzes Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">8</div>
                            <div className="text-sm text-gray-500">Memories Viewed</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Most Viewed Memories</h3>
                        <ul className="space-y-2">
                          {memories.slice(0, 3).map((memory) => (
                            <li key={memory.id} className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-gray-500" />
                              </div>
                              <span>{memory.title}</span>
                              <span className="ml-auto text-sm text-gray-500">Viewed 5 times</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
