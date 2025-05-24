"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { QuizQuestion } from "@/lib/types"
import confetti from "canvas-confetti"

interface MemoryQuizProps {
  question: QuizQuestion
  onAnswer: (question: QuizQuestion, selectedAnswer: string) => void
  quizCompleted: boolean
  correctAnswers: number
  totalQuestions: number
  onClose: () => void
}

export function MemoryQuiz({
  question,
  onAnswer,
  quizCompleted,
  correctAnswers,
  totalQuestions,
  onClose,
}: MemoryQuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(question, selectedOption)
      setSelectedOption(null)

      // If the answer is correct, show confetti
      if (selectedOption === question.correctAnswer) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    }
  }

  if (quizCompleted) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-xl text-center">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {correctAnswers} / {totalQuestions}
          </div>
          <p className="text-lg">
            {correctAnswers === totalQuestions
              ? "Perfect score! Amazing job remembering these details!"
              : "Great effort! Keep practicing to improve your memory."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0">
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={onClose}>
            Continue Browsing Memories
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
        <CardTitle className="text-xl">Memory Quiz</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{question.question}</h3>

          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" onClick={onClose}>
          Skip Quiz
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={!selectedOption}>
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  )
}
