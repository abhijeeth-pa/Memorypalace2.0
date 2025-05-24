"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react"
import type { Memory, QuizQuestion } from "@/lib/types"
import { MemoryQuiz } from "@/components/memory-quiz"
import { useToast } from "@/hooks/use-toast"

interface MemoryViewerProps {
  memory: Memory
  onNext: () => void
  onPrevious: () => void
  totalMemories: number
  currentIndex: number
}

export function MemoryViewer({ memory, onNext, onPrevious, totalMemories, currentIndex }: MemoryViewerProps) {
  const { toast } = useToast()
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const handleSpeakCaption = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(memory.aiCaption)
      utterance.rate = 0.9 // Slightly slower
      window.speechSynthesis.speak(utterance)

      toast({
        title: "Speaking caption",
        description: "The caption is being read aloud",
      })
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive",
      })
    }
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestion(0)
    setQuizCompleted(false)
    setCorrectAnswers(0)
  }

  const handleQuizAnswer = (question: QuizQuestion, selectedAnswer: string) => {
    if (selectedAnswer === question.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1)
      toast({
        title: "Correct!",
        description: "That's the right answer!",
      })
    } else {
      toast({
        title: "That's okay",
        description: `The answer was: ${question.correctAnswer}`,
      })
    }

    // Move to next question or complete quiz
    if (currentQuestion < memory.quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setQuizCompleted(true)

      // Save quiz results to localStorage
      const quizResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
      quizResults.push({
        memoryId: memory.id,
        date: new Date().toISOString(),
        correctAnswers,
        totalQuestions: memory.quizQuestions.length,
      })
      localStorage.setItem("quizResults", JSON.stringify(quizResults))
    }
  }

  const handleCloseQuiz = () => {
    setShowQuiz(false)
  }

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={memory.imageUrl || "/placeholder.svg"}
          alt={memory.title}
          className="w-full h-auto max-h-[500px] object-contain bg-black"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-2xl font-bold">{memory.title}</h2>
          <p className="text-sm opacity-90">{memory.date}</p>
        </div>
      </div>

      <CardHeader className="p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{memory.title}</CardTitle>
          <Badge className="text-lg px-3 py-1">{memory.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Description</h3>
          </div>
          <p className="text-lg">{memory.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">AI Caption</h3>
            <Button variant="outline" size="sm" onClick={handleSpeakCaption}>
              <Volume2 className="h-4 w-4 mr-2" />
              Read Aloud
            </Button>
          </div>
          <p className="text-lg p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">{memory.aiCaption}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {memory.aiTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-gray-500">
            Memory {currentIndex + 1} of {totalMemories}
          </p>

          {!showQuiz && (
            <Button className="bg-purple-600 hover:bg-purple-700 text-lg" onClick={handleStartQuiz}>
              Test Your Memory
            </Button>
          )}
        </div>

        {showQuiz && (
          <MemoryQuiz
            question={memory.quizQuestions[currentQuestion]}
            onAnswer={handleQuizAnswer}
            quizCompleted={quizCompleted}
            correctAnswers={correctAnswers}
            totalQuestions={memory.quizQuestions.length}
            onClose={handleCloseQuiz}
          />
        )}

        <div className="flex justify-between w-full">
          <Button variant="outline" size="lg" className="text-lg" onClick={onPrevious}>
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="lg" className="text-lg" onClick={onNext}>
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
