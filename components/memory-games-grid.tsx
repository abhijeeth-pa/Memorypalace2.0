"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Trophy, Target } from "lucide-react"
import { memoryGames, difficultyColors, gameTypeIcons } from "@/lib/games-data"
import type { MemoryGame, GameSession } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface MemoryGamesGridProps {
  onGameStart: (game: MemoryGame) => void
  recentSessions?: GameSession[]
}

export function MemoryGamesGrid({ onGameStart, recentSessions = [] }: MemoryGamesGridProps) {
  const { toast } = useToast()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredGames = memoryGames.filter((game) => {
    if (selectedDifficulty && game.difficulty !== selectedDifficulty) return false
    if (selectedType && game.type !== selectedType) return false
    return true
  })

  const getGameStats = (gameId: string) => {
    const sessions = recentSessions.filter((session) => session.gameId === gameId)
    if (sessions.length === 0) return null

    const avgScore =
      sessions.reduce((sum, session) => sum + (session.score / session.maxScore) * 100, 0) / sessions.length
    const bestScore = Math.max(...sessions.map((session) => (session.score / session.maxScore) * 100))
    const timesPlayed = sessions.length

    return { avgScore: Math.round(avgScore), bestScore: Math.round(bestScore), timesPlayed }
  }

  const handleGameStart = (game: MemoryGame) => {
    toast({
      title: `Starting ${game.name}`,
      description: `Get ready for ${game.estimatedTime} minutes of brain training!`,
    })
    onGameStart(game)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(null)}
          >
            All Levels
          </Button>
          <Button
            variant={selectedDifficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("easy")}
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("medium")}
          >
            Medium
          </Button>
          <Button
            variant={selectedDifficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("hard")}
          >
            Hard
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(null)}
          >
            All Types
          </Button>
          <Button
            variant={selectedType === "matching" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("matching")}
          >
            🎯 Matching
          </Button>
          <Button
            variant={selectedType === "sequence" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("sequence")}
          >
            🔄 Sequence
          </Button>
          <Button
            variant={selectedType === "puzzle" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("puzzle")}
          >
            🧩 Puzzle
          </Button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => {
          const stats = getGameStats(game.id)
          return (
            <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{game.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={difficultyColors[game.difficulty]} variant="secondary">
                          {game.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {gameTypeIcons[game.type]} {game.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">{game.description}</CardDescription>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{game.estimatedTime} min</span>
                  </div>
                  {stats && (
                    <>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{stats.avgScore}% avg</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{stats.bestScore}% best</span>
                      </div>
                    </>
                  )}
                </div>

                {stats && (
                  <div className="text-xs text-gray-500">
                    Played {stats.timesPlayed} time{stats.timesPlayed !== 1 ? "s" : ""}
                  </div>
                )}

                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleGameStart(game)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No games match your current filters.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDifficulty(null)
              setSelectedType(null)
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
