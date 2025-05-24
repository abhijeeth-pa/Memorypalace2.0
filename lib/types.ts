export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

export interface Memory {
  id: string
  title: string
  description: string
  date: string
  category: string
  imageUrl: string
  aiTags: string[]
  aiCaption: string
  quizQuestions: QuizQuestion[]
}

export interface QuizResult {
  memoryId: string
  date: string
  correctAnswers: number
  totalQuestions: number
}

export interface MemoryGame {
  id: string
  name: string
  description: string
  type: "matching" | "sequence" | "puzzle" | "word" | "visual"
  difficulty: "easy" | "medium" | "hard"
  icon: string
  estimatedTime: number // in minutes
}

export interface GameSession {
  id: string
  gameId: string
  userId: string
  score: number
  maxScore: number
  timeSpent: number // in seconds
  difficulty: string
  completedAt: string
  mistakes: number
}

export interface PatientProgress {
  userId: string
  totalGamesPlayed: number
  totalTimeSpent: number
  averageScore: number
  improvementRate: number
  favoriteGameType: string
  weeklyProgress: {
    week: string
    gamesPlayed: number
    averageScore: number
    timeSpent: number
  }[]
  gameTypeProgress: {
    type: string
    gamesPlayed: number
    averageScore: number
    bestScore: number
  }[]
}

export interface User {
  id: string
  name: string
  email: string
  userType: "family" | "patient"
  avatar?: string
  createdAt: string
  role?: string
}

export interface Notification {
  id: string
  type: "memory_viewed" | "quiz_completed" | "memory_added" | "game_completed" | "progress_milestone"
  message: string
  time: string
  read: boolean
  userId?: string
}
