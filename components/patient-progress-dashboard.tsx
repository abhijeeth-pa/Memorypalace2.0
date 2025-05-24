"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock, Trophy, Target, Brain, Calendar, Gamepad2 } from "lucide-react"
import type { PatientProgress, GameSession } from "@/lib/types"
import { gameTypeIcons } from "@/lib/games-data"

interface PatientProgressDashboardProps {
  progress: PatientProgress
  recentSessions: GameSession[]
}

export function PatientProgressDashboard({ progress, recentSessions }: PatientProgressDashboardProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getImprovementIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (rate < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  const thisWeekProgress = progress.weeklyProgress[progress.weeklyProgress.length - 1]
  const lastWeekProgress = progress.weeklyProgress[progress.weeklyProgress.length - 2]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Games Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progress.totalGamesPlayed}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              {getImprovementIcon(progress.improvementRate)}
              <span>{Math.abs(progress.improvementRate)}% vs last week</span>
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
            <div className={`text-3xl font-bold ${getScoreColor(progress.averageScore)}`}>
              {Math.round(progress.averageScore)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {thisWeekProgress && lastWeekProgress && (
                <span>
                  {thisWeekProgress.averageScore > lastWeekProgress.averageScore ? "+" : ""}
                  {Math.round(thisWeekProgress.averageScore - lastWeekProgress.averageScore)}% this week
                </span>
              )}
            </div>
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
            <div className="text-3xl font-bold">{formatTime(progress.totalTimeSpent)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {thisWeekProgress && <span>{formatTime(thisWeekProgress.timeSpent)} this week</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Favorite Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize flex items-center gap-2">
              <span>{gameTypeIcons[progress.favoriteGameType as keyof typeof gameTypeIcons]}</span>
              {progress.favoriteGameType}
            </div>
            <div className="text-xs text-gray-500 mt-1">Most played category</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
          <CardDescription>Performance over the last few weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress.weeklyProgress.slice(-4).map((week, index) => (
              <div key={week.week} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{week.week}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{week.gamesPlayed} games</span>
                    <span className={getScoreColor(week.averageScore)}>{Math.round(week.averageScore)}% avg</span>
                    <span>{formatTime(week.timeSpent)}</span>
                  </div>
                </div>
                <Progress value={week.averageScore} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Type Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Performance by Game Type
          </CardTitle>
          <CardDescription>How well you're doing in different types of games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.gameTypeProgress.map((gameType) => (
              <div key={gameType.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{gameTypeIcons[gameType.type as keyof typeof gameTypeIcons]}</span>
                    <span className="font-medium capitalize">{gameType.type}</span>
                  </div>
                  <Badge variant="outline">{gameType.gamesPlayed} played</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className={getScoreColor(gameType.averageScore)}>{Math.round(gameType.averageScore)}%</span>
                  </div>
                  <Progress value={gameType.averageScore} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Best Score: {Math.round(gameType.bestScore)}%</span>
                    <span>{gameType.gamesPlayed} games completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Game Sessions</CardTitle>
          <CardDescription>Your latest gaming activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.slice(0, 5).map((session) => (
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
                  <div className={`text-lg font-bold ${getScoreColor(session.score)}`}>{session.score}%</div>
                  <div className="text-xs text-gray-500">{session.mistakes} mistakes</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
