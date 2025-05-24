"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Menu, Gamepad2, BarChart3 } from "lucide-react"
import { MemoryViewer } from "@/components/memory-viewer"
import { MemoryGamesGrid } from "@/components/memory-games-grid"
import { GamePlayer } from "@/components/game-player"
import { PatientProgressDashboard } from "@/components/patient-progress-dashboard"
import { PatientDashboardHeader } from "@/components/patient-dashboard-header"
import { mockMemories } from "@/lib/mock-data"
import type { Memory, MemoryGame, GameSession, PatientProgress } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

export default function PatientDashboard() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState("memories")
  const [currentGame, setCurrentGame] = useState<MemoryGame | null>(null)
  const [gameSessions, setGameSessions] = useState<GameSession[]>([])
  const [patientProgress, setPatientProgress] = useState<PatientProgress | null>(null)

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
    }

    // Generate mock patient progress
    generateMockProgress()
  }, [])

  const generateMockProgress = () => {
    const mockProgress: PatientProgress = {
      userId: "current-user",
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

  const handleLogout = () => {
    router.push("/")
  }

  const currentMemory = memories[currentMemoryIndex]

  const goToNextMemory = () => {
    setCurrentMemoryIndex((prev) => (prev + 1) % memories.length)
  }

  const goToPreviousMemory = () => {
    setCurrentMemoryIndex((prev) => (prev - 1 + memories.length) % memories.length)
  }

  const handleGameStart = (game: MemoryGame) => {
    setCurrentGame(game)
  }

  const handleGameComplete = (session: GameSession) => {
    const updatedSessions = [...gameSessions, session]
    setGameSessions(updatedSessions)
    localStorage.setItem("gameSessions", JSON.stringify(updatedSessions))

    // Update progress
    if (patientProgress) {
      const updatedProgress = {
        ...patientProgress,
        totalGamesPlayed: patientProgress.totalGamesPlayed + 1,
        totalTimeSpent: patientProgress.totalTimeSpent + session.timeSpent,
        averageScore: Math.round(
          (patientProgress.averageScore * patientProgress.totalGamesPlayed + session.score) /
            (patientProgress.totalGamesPlayed + 1),
        ),
      }
      setPatientProgress(updatedProgress)
    }

    setCurrentGame(null)
  }

  const handleBackToGames = () => {
    setCurrentGame(null)
  }

  if (currentGame) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <PatientDashboardHeader
          user={{
            id: "1",
            name: "Patient User",
            email: "patient@example.com",
            userType: "patient",
            createdAt: new Date().toISOString(),
          }}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 md:p-6">
          <GamePlayer game={currentGame} onGameComplete={handleGameComplete} onBack={handleBackToGames} />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <PatientDashboardHeader
        user={{
          id: "1",
          name: "Patient User",
          email: "patient@example.com",
          userType: "patient",
          createdAt: new Date().toISOString(),
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-6">
              <TabsTrigger value="memories" className="text-sm">
                📸 Memories
              </TabsTrigger>
              <TabsTrigger value="games" className="text-sm">
                🎮 Games
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-sm">
                📊 Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="memories">
              {memories.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <MemoryViewer
                    memory={currentMemory}
                    onNext={goToNextMemory}
                    onPrevious={goToPreviousMemory}
                    totalMemories={memories.length}
                    currentIndex={currentMemoryIndex}
                  />
                </motion.div>
              ) : (
                <Card className="text-center p-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">No Memories Yet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">Your family members haven't added any memories yet.</p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button className="text-lg bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/")}>
                      Return Home
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="games">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Memory Training Games</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Exercise your mind with fun games designed to improve memory and cognitive function.
                  </p>
                </div>
                <MemoryGamesGrid onGameStart={handleGameStart} recentSessions={gameSessions} />
              </motion.div>
            </TabsContent>

            <TabsContent value="progress">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track your improvement and see how you're doing with memory exercises.
                  </p>
                </div>
                {patientProgress && (
                  <PatientProgressDashboard progress={patientProgress} recentSessions={gameSessions} />
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <div className="fixed bottom-24 right-6 flex flex-col gap-2">
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
                  onClick={() => setActiveTab("progress")}
                >
                  <BarChart3 className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
                  onClick={() => setActiveTab("games")}
                >
                  <Gamepad2 className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300"
                >
                  <Settings className="h-6 w-6" />
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
