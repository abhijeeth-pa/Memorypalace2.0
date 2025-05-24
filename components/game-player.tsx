"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ArrowLeft, RotateCcw } from "lucide-react"
import type { MemoryGame, GameSession } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { events, type LifeEvent } from "@/lib/events" // Declare the events variable

interface GamePlayerProps {
  game: MemoryGame
  onGameComplete: (session: GameSession) => void
  onBack: () => void
}

// Game-specific interfaces
interface MemoryCard {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

interface PuzzlePiece {
  id: number
  correctPosition: number
  currentPosition: number
  imageUrl: string
}

interface WordPair {
  id: number
  word: string
  category: string
  matched: boolean
}

interface FamilyMember {
  id: number
  name: string
  imageUrl: string
  matched: boolean
}

export function GamePlayer({ game, onGameComplete, onBack }: GamePlayerProps) {
  const { toast } = useToast()
  const [gameState, setGameState] = useState<"playing" | "completed">("playing")
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(100)
  const [timeSpent, setTimeSpent] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [progress, setProgress] = useState(0)

  // Memory Cards Game State
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)

  // Sequence Game State
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [showingSequence, setShowingSequence] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [round, setRound] = useState(1)

  // Photo Puzzle State
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)

  // Word Association State
  const [wordPairs, setWordPairs] = useState<WordPair[]>([])
  const [selectedWords, setSelectedWords] = useState<number[]>([])

  // Spot Difference State
  const [differences, setDifferences] = useState<{ x: number; y: number; found: boolean }[]>([])
  const [foundDifferences, setFoundDifferences] = useState<number[]>([])

  // Story Builder State
  const [storyPrompts, setStoryPrompts] = useState<string[]>([])
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [userStory, setUserStory] = useState("")
  const [storyParts, setStoryParts] = useState<string[]>([])

  // Face-Name Match State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedFace, setSelectedFace] = useState<number | null>(null)
  const [selectedName, setSelectedName] = useState<number | null>(null)

  // Timeline Sort State
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([])
  const [draggedEvent, setDraggedEvent] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    initializeGame()

    return () => clearInterval(timer)
  }, [game.id])

  const initializeGame = () => {
    setScore(0)
    setMistakes(0)
    setProgress(0)
    setGameState("playing")

    switch (game.id) {
      case "memory-cards":
        initializeMemoryCards()
        break
      case "sequence-recall":
        initializeSequenceGame()
        break
      case "photo-puzzle":
        initializePhotoPuzzle()
        break
      case "word-association":
        initializeWordAssociation()
        break
      case "spot-difference":
        initializeSpotDifference()
        break
      case "story-builder":
        initializeStoryBuilder()
        break
      case "face-name-match":
        initializeFaceNameMatch()
        break
      case "timeline-sort":
        initializeTimelineSort()
        break
    }
  }

  // Memory Cards Implementation
  const initializeMemoryCards = () => {
    const symbols = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"]
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        value: symbol,
        flipped: false,
        matched: false,
      }))

    setCards(gameCards)
    setMaxScore(symbols.length)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].flipped || cards[cardId].matched) return

    const newCards = [...cards]
    newCards[cardId].flipped = true
    setCards(newCards)

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      setTimeout(() => {
        const [first, second] = newFlippedCards
        if (cards[first].value === cards[second].value) {
          const updatedCards = [...newCards]
          updatedCards[first].matched = true
          updatedCards[second].matched = true
          setCards(updatedCards)
          setScore((prev) => prev + 1)
          setProgress((prev) => prev + 100 / (cards.length / 2))

          if (updatedCards.every((card) => card.matched)) {
            completeGame()
          }
        } else {
          const updatedCards = [...newCards]
          updatedCards[first].flipped = false
          updatedCards[second].flipped = false
          setCards(updatedCards)
          setMistakes((prev) => prev + 1)
        }
        setFlippedCards([])
      }, 1000)
    }
  }

  // Sequence Recall Implementation
  const initializeSequenceGame = () => {
    setMaxScore(10)
    setRound(1)
    generateNewSequence(1)
  }

  const generateNewSequence = (roundNumber: number) => {
    const sequenceLength = Math.min(3 + roundNumber, 8)
    const newSequence = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 4))
    setSequence(newSequence)
    setUserSequence([])
    showSequenceToUser(newSequence)
  }

  const showSequenceToUser = (seq: number[]) => {
    setShowingSequence(true)
    setCurrentStep(0)

    const showNext = (index: number) => {
      if (index < seq.length) {
        setCurrentStep(index)
        setTimeout(() => showNext(index + 1), 800)
      } else {
        setShowingSequence(false)
        setCurrentStep(-1)
      }
    }

    setTimeout(() => showNext(0), 500)
  }

  const handleSequenceClick = (colorIndex: number) => {
    if (showingSequence) return

    const newUserSequence = [...userSequence, colorIndex]
    setUserSequence(newUserSequence)

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setMistakes((prev) => prev + 1)
      toast({
        title: "Oops!",
        description: "That's not the right sequence. Try again!",
        variant: "destructive",
      })
      setUserSequence([])
      return
    }

    if (newUserSequence.length === sequence.length) {
      setScore((prev) => prev + 1)
      setProgress((prev) => prev + 10)

      if (round >= maxScore) {
        completeGame()
      } else {
        setRound((prev) => prev + 1)
        setTimeout(() => generateNewSequence(round + 1), 1000)
      }
    }
  }

  // Photo Puzzle Implementation
  const initializePhotoPuzzle = () => {
    const pieces: PuzzlePiece[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      correctPosition: i,
      currentPosition: i,
      imageUrl: `/placeholder.svg?height=100&width=100&text=${i + 1}`,
    }))

    // Shuffle pieces
    const shuffled = [...pieces].sort(() => Math.random() - 0.5)
    shuffled.forEach((piece, index) => {
      piece.currentPosition = index
    })

    setPuzzlePieces(shuffled)
    setMaxScore(9)
  }

  const handlePuzzlePieceClick = (pieceId: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(pieceId)
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null)
    } else {
      // Swap pieces
      const newPieces = [...puzzlePieces]
      const piece1Index = newPieces.findIndex((p) => p.id === selectedPiece)
      const piece2Index = newPieces.findIndex((p) => p.id === pieceId)

      const temp = newPieces[piece1Index].currentPosition
      newPieces[piece1Index].currentPosition = newPieces[piece2Index].currentPosition
      newPieces[piece2Index].currentPosition = temp

      setPuzzlePieces(newPieces)
      setSelectedPiece(null)
      setMoves((prev) => prev + 1)

      // Check if puzzle is solved
      const correctPieces = newPieces.filter((p) => p.id === p.currentPosition).length
      setScore(correctPieces)
      setProgress((correctPieces / 9) * 100)

      if (correctPieces === 9) {
        completeGame()
      }
    }
  }

  // Word Association Implementation
  const initializeWordAssociation = () => {
    const wordCategories = [
      { words: ["Apple", "Banana", "Orange", "Grape"], category: "Fruits" },
      { words: ["Dog", "Cat", "Bird", "Fish"], category: "Animals" },
      { words: ["Red", "Blue", "Green", "Yellow"], category: "Colors" },
      { words: ["Car", "Bus", "Train", "Plane"], category: "Transport" },
    ]

    const allWords: WordPair[] = []
    wordCategories.forEach((cat, catIndex) => {
      cat.words.forEach((word, wordIndex) => {
        allWords.push({
          id: catIndex * 4 + wordIndex,
          word,
          category: cat.category,
          matched: false,
        })
      })
    })

    setWordPairs(allWords.sort(() => Math.random() - 0.5))
    setMaxScore(4) // 4 categories
  }

  const handleWordClick = (wordId: number) => {
    if (selectedWords.includes(wordId)) {
      setSelectedWords(selectedWords.filter((id) => id !== wordId))
      return
    }

    const newSelected = [...selectedWords, wordId]
    setSelectedWords(newSelected)

    if (newSelected.length === 4) {
      // Check if all selected words are from the same category
      const selectedWordObjects = wordPairs.filter((w) => newSelected.includes(w.id))
      const categories = [...new Set(selectedWordObjects.map((w) => w.category))]

      if (categories.length === 1) {
        // Correct match
        const newWordPairs = wordPairs.map((w) => (newSelected.includes(w.id) ? { ...w, matched: true } : w))
        setWordPairs(newWordPairs)
        setScore((prev) => prev + 1)
        setProgress((prev) => prev + 25)

        toast({
          title: "Great match!",
          description: `You found all ${categories[0]}!`,
        })

        if (newWordPairs.every((w) => w.matched)) {
          completeGame()
        }
      } else {
        setMistakes((prev) => prev + 1)
        toast({
          title: "Not quite right",
          description: "Try to group words from the same category",
          variant: "destructive",
        })
      }
      setSelectedWords([])
    }
  }

  // Spot the Difference Implementation
  const initializeSpotDifference = () => {
    const diffs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      found: false,
    }))
    setDifferences(diffs)
    setMaxScore(5)
  }

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>, imageIndex: number) => {
    if (imageIndex !== 1) return // Only right image is clickable

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is near any unfound difference
    const clickedDiff = differences.findIndex((diff, index) => {
      if (foundDifferences.includes(index)) return false
      const distance = Math.sqrt((x - diff.x) ** 2 + (y - diff.y) ** 2)
      return distance < 30
    })

    if (clickedDiff !== -1) {
      setFoundDifferences([...foundDifferences, clickedDiff])
      setScore((prev) => prev + 1)
      setProgress((prev) => prev + 20)

      toast({
        title: "Found it!",
        description: `You found difference ${foundDifferences.length + 1}/5`,
      })

      if (foundDifferences.length + 1 === 5) {
        completeGame()
      }
    } else {
      setMistakes((prev) => prev + 1)
    }
  }

  // Story Builder Implementation
  const initializeStoryBuilder = () => {
    const prompts = [
      "Once upon a time, in a small village...",
      "The old photograph reminded me of...",
      "Every Sunday, our family would...",
      "I remember the day when...",
      "The smell of grandmother's cooking...",
    ]
    setStoryPrompts(prompts)
    setCurrentPrompt(0)
    setMaxScore(prompts.length)
    setStoryParts([])
  }

  const handleStorySubmit = () => {
    if (userStory.trim().length < 20) {
      toast({
        title: "Story too short",
        description: "Please write at least 20 characters to continue the story",
        variant: "destructive",
      })
      return
    }

    const newStoryParts = [...storyParts, userStory.trim()]
    setStoryParts(newStoryParts)
    setScore((prev) => prev + 1)
    setProgress(((currentPrompt + 1) / storyPrompts.length) * 100)
    setUserStory("")

    if (currentPrompt + 1 >= storyPrompts.length) {
      completeGame()
    } else {
      setCurrentPrompt((prev) => prev + 1)
    }
  }

  // Face-Name Match Implementation
  const initializeFaceNameMatch = () => {
    const members: FamilyMember[] = [
      { id: 0, name: "Grandma Mary", imageUrl: "/placeholder.svg?height=100&width=100&text=GM", matched: false },
      { id: 1, name: "Grandpa John", imageUrl: "/placeholder.svg?height=100&width=100&text=GJ", matched: false },
      { id: 2, name: "Uncle Bob", imageUrl: "/placeholder.svg?height=100&width=100&text=UB", matched: false },
      { id: 3, name: "Aunt Sarah", imageUrl: "/placeholder.svg?height=100&width=100&text=AS", matched: false },
      { id: 4, name: "Cousin Mike", imageUrl: "/placeholder.svg?height=100&width=100&text=CM", matched: false },
      { id: 5, name: "Sister Emma", imageUrl: "/placeholder.svg?height=100&width=100&text=SE", matched: false },
    ]
    setFamilyMembers(members)
    setMaxScore(members.length)
  }

  const handleFaceClick = (memberId: number) => {
    setSelectedFace(memberId)
    if (selectedName !== null) {
      checkFaceNameMatch(memberId, selectedName)
    }
  }

  const handleNameClick = (memberId: number) => {
    setSelectedName(memberId)
    if (selectedFace !== null) {
      checkFaceNameMatch(selectedFace, memberId)
    }
  }

  const checkFaceNameMatch = (faceId: number, nameId: number) => {
    if (faceId === nameId) {
      const newMembers = familyMembers.map((m) => (m.id === faceId ? { ...m, matched: true } : m))
      setFamilyMembers(newMembers)
      setScore((prev) => prev + 1)
      setProgress((prev) => prev + 100 / familyMembers.length)

      toast({
        title: "Perfect match!",
        description: `You correctly matched ${familyMembers[faceId].name}!`,
      })

      if (newMembers.every((m) => m.matched)) {
        completeGame()
      }
    } else {
      setMistakes((prev) => prev + 1)
      toast({
        title: "Not quite right",
        description: "Try again!",
        variant: "destructive",
      })
    }

    setSelectedFace(null)
    setSelectedName(null)
  }

  // Timeline Sort Implementation
  const initializeTimelineSort = () => {
    const shuffledEvents = [...events].sort(() => Math.random() - 0.5)
    shuffledEvents.forEach((event, index) => {
      event.currentOrder = index
    })

    setLifeEvents(shuffledEvents)
    setMaxScore(events.length)
  }

  const handleEventDragStart = (eventId: number) => {
    setDraggedEvent(eventId)
  }

  const handleEventDrop = (targetOrder: number) => {
    if (draggedEvent === null) return

    const newEvents = [...lifeEvents]
    const draggedIndex = newEvents.findIndex((e) => e.id === draggedEvent)
    const targetIndex = newEvents.findIndex((e) => e.currentOrder === targetOrder)

    // Swap positions
    const temp = newEvents[draggedIndex].currentOrder
    newEvents[draggedIndex].currentOrder = newEvents[targetIndex].currentOrder
    newEvents[targetIndex].currentOrder = temp

    setLifeEvents(newEvents)
    setDraggedEvent(null)
    setMoves((prev) => prev + 1)

    // Check if timeline is correct
    const correctEvents = newEvents.filter((e) => e.correctOrder === e.currentOrder).length
    setScore(correctEvents)
    setProgress((correctEvents / events.length) * 100)

    if (correctEvents === events.length) {
      completeGame()
    }
  }

  const completeGame = () => {
    setGameState("completed")

    let finalScore = 0
    switch (game.id) {
      case "memory-cards":
        finalScore = Math.max(0, 100 - mistakes * 10 - (moves > maxScore ? (moves - maxScore) * 5 : 0))
        break
      case "sequence-recall":
        finalScore = (score / maxScore) * 100
        break
      case "photo-puzzle":
      case "timeline-sort":
        finalScore = Math.max(0, 100 - mistakes * 5 - (moves > 20 ? (moves - 20) * 2 : 0))
        break
      case "word-association":
      case "face-name-match":
        finalScore = Math.max(0, 100 - mistakes * 15)
        break
      case "spot-difference":
        finalScore = Math.max(0, 100 - mistakes * 10)
        break
      case "story-builder":
        finalScore = (score / maxScore) * 100
        break
      default:
        finalScore = (score / maxScore) * 100
    }

    const session: GameSession = {
      id: Date.now().toString(),
      gameId: game.id,
      userId: "current-user",
      score: Math.round(finalScore),
      maxScore: 100,
      timeSpent,
      difficulty: game.difficulty,
      completedAt: new Date().toISOString(),
      mistakes,
    }

    if (finalScore >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    onGameComplete(session)
  }

  const resetGame = () => {
    setScore(0)
    setMistakes(0)
    setMoves(0)
    setTimeSpent(0)
    setProgress(0)
    setGameState("playing")
    setFlippedCards([])
    setUserSequence([])
    setSelectedPiece(null)
    setSelectedWords([])
    setFoundDifferences([])
    setUserStory("")
    setStoryParts([])
    setCurrentPrompt(0)
    setSelectedFace(null)
    setSelectedName(null)
    setDraggedEvent(null)
    initializeGame()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (gameState === "completed") {
    let finalScore = 0
    switch (game.id) {
      case "memory-cards":
        finalScore = Math.max(0, 100 - mistakes * 10 - (moves > maxScore ? (moves - maxScore) * 5 : 0))
        break
      case "sequence-recall":
        finalScore = (score / maxScore) * 100
        break
      case "photo-puzzle":
      case "timeline-sort":
        finalScore = Math.max(0, 100 - mistakes * 5 - (moves > 20 ? (moves - 20) * 2 : 0))
        break
      case "word-association":
        finalScore = Math.max(0, 100 - mistakes * 15)
        break
      case "spot-difference":
        finalScore = Math.max(0, 100 - mistakes * 10)
        break
      case "story-builder":
        finalScore = (score / maxScore) * 100
        break
      default:
        finalScore = (score / maxScore) * 100
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🎉 Game Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-6xl font-bold text-purple-600">{Math.round(finalScore)}%</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{formatTime(timeSpent)}</div>
              <div className="text-sm text-gray-500">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{mistakes}</div>
              <div className="text-sm text-gray-500">Mistakes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{moves || score}</div>
              <div className="text-sm text-gray-500">
                {game.id === "memory-cards" || game.id === "photo-puzzle" || game.id === "timeline-sort"
                  ? "Moves"
                  : "Points"}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{game.icon}</span>
                  {game.name}
                </CardTitle>
                <p className="text-sm text-gray-500">{game.description}</p>
              </div>
            </div>
            <Button onClick={resetGame} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <span>Time: {formatTime(timeSpent)}</span>
              <span>
                Score: {score}/{maxScore}
              </span>
              <span>Mistakes: {mistakes}</span>
              {(game.id === "memory-cards" || game.id === "photo-puzzle" || game.id === "timeline-sort") && (
                <span>Moves: {moves}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>Progress:</span>
              <Progress value={progress} className="w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Content */}
      <Card>
        <CardContent className="p-6">
          {/* Memory Cards Game */}
          {game.id === "memory-cards" && (
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
                    card.flipped || card.matched
                      ? card.matched
                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                        : "bg-blue-100 text-blue-800 border-2 border-blue-300"
                      : "bg-gray-200 hover:bg-gray-300 border-2 border-gray-300"
                  }`}
                  disabled={card.flipped || card.matched || flippedCards.length === 2}
                >
                  {card.flipped || card.matched ? card.value : "?"}
                </button>
              ))}
            </div>
          )}

          {/* Sequence Recall Game */}
          {game.id === "sequence-recall" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Round {round}</h3>
                {showingSequence ? (
                  <p className="text-lg">Watch the sequence...</p>
                ) : (
                  <p className="text-lg">Repeat the sequence by clicking the colors</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                {["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400"].map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleSequenceClick(index)}
                    className={`aspect-square rounded-lg ${color} hover:opacity-80 transition-all ${
                      showingSequence && currentStep === index ? "ring-4 ring-white scale-110" : ""
                    } ${!showingSequence && userSequence.includes(index) ? "ring-2 ring-gray-600" : ""}`}
                    disabled={showingSequence}
                  />
                ))}
              </div>

              {!showingSequence && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Sequence length: {sequence.length} | Your progress: {userSequence.length}/{sequence.length}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Photo Puzzle Game */}
          {game.id === "photo-puzzle" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg mb-4">Arrange the pieces to complete the family photo</p>
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                {Array.from({ length: 9 }, (_, position) => {
                  const piece = puzzlePieces.find((p) => p.currentPosition === position)
                  return (
                    <button
                      key={position}
                      onClick={() => piece && handlePuzzlePieceClick(piece.id)}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center text-lg font-bold ${
                        selectedPiece === piece?.id
                          ? "border-purple-500 bg-purple-100"
                          : piece?.id === piece?.correctPosition
                            ? "border-green-500 bg-green-100"
                            : "border-gray-300 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {piece ? piece.id + 1 : ""}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Word Association Game */}
          {game.id === "word-association" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg mb-4">Group words that belong to the same category (select 4 at a time)</p>
                <p className="text-sm text-gray-500">Selected: {selectedWords.length}/4</p>
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                {wordPairs.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => handleWordClick(word.id)}
                    disabled={word.matched}
                    className={`p-3 rounded-lg text-center font-medium transition-all ${
                      word.matched
                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                        : selectedWords.includes(word.id)
                          ? "bg-purple-100 text-purple-800 border-2 border-purple-300"
                          : "bg-gray-100 hover:bg-gray-200 border-2 border-gray-300"
                    }`}
                  >
                    {word.word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spot the Difference Game */}
          {game.id === "spot-difference" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg mb-4">Find 5 differences between the two images</p>
                <p className="text-sm text-gray-500">Found: {foundDifferences.length}/5</p>
              </div>
              <div className="flex gap-4 justify-center">
                {[0, 1].map((imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer"
                    onClick={(e) => handleImageClick(e, imageIndex)}
                  >
                    <div className="w-80 h-60 bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                      <span className="text-lg font-bold">Family Photo {imageIndex + 1}</span>
                    </div>
                    {imageIndex === 1 &&
                      differences.map((diff, index) => (
                        <div
                          key={index}
                          className={`absolute w-6 h-6 border-2 border-red-500 rounded-full ${
                            foundDifferences.includes(index) ? "bg-red-200" : "bg-transparent"
                          }`}
                          style={{ left: diff.x, top: diff.y }}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Story Builder Game */}
          {game.id === "story-builder" && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-lg mb-4">Continue the story based on the prompt</p>
                <p className="text-sm text-gray-500">
                  Part {currentPrompt + 1} of {storyPrompts.length}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-lg font-medium">{storyPrompts[currentPrompt]}</p>
                </div>

                {storyParts.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Your story so far:</h4>
                    <p className="text-sm">{storyParts.join(" ")}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Input
                    value={userStory}
                    onChange={(e) => setUserStory(e.target.value)}
                    placeholder="Continue the story..."
                    className="min-h-[100px]"
                  />
                  <Button onClick={handleStorySubmit} disabled={userStory.trim().length < 20} className="w-full">
                    Continue Story
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Face-Name Match Game */}
          {game.id === "face-name-match" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg mb-4">Match family member faces with their names</p>
              </div>

              <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-center">Faces</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {familyMembers.map((member) => (
                      <button
                        key={`face-${member.id}`}
                        onClick={() => handleFaceClick(member.id)}
                        disabled={member.matched}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          member.matched
                            ? "border-green-500 bg-green-100"
                            : selectedFace === member.id
                              ? "border-purple-500 bg-purple-100"
                              : "border-gray-300 bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-center">Names</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {familyMembers.map((member) => (
                      <button
                        key={`name-${member.id}`}
                        onClick={() => handleNameClick(member.id)}
                        disabled={member.matched}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          member.matched
                            ? "border-green-500 bg-green-100"
                            : selectedName === member.id
                              ? "border-purple-500 bg-purple-100"
                              : "border-gray-300 bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {member.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Sort Game */}
          {game.id === "timeline-sort" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg mb-4">Arrange life events in chronological order</p>
                <p className="text-sm text-gray-500">Drag and drop to reorder</p>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                {lifeEvents
                  .sort((a, b) => a.currentOrder - b.currentOrder)
                  .map((event, index) => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={() => handleEventDragStart(event.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleEventDrop(index)}
                      className={`p-4 rounded-lg border-2 cursor-move transition-all ${
                        event.correctOrder === event.currentOrder
                          ? "border-green-500 bg-green-100"
                          : "border-gray-300 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold">{event.event}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{event.year}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
