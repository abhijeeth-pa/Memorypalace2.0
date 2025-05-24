import type { MemoryGame } from "./types"

export const memoryGames: MemoryGame[] = [
  {
    id: "memory-cards",
    name: "Memory Cards",
    description: "Match pairs of cards to improve visual memory and concentration",
    type: "matching",
    difficulty: "easy",
    icon: "🃏",
    estimatedTime: 5,
  },
  {
    id: "sequence-recall",
    name: "Sequence Recall",
    description: "Remember and repeat sequences of colors, sounds, or numbers",
    type: "sequence",
    difficulty: "medium",
    icon: "🔢",
    estimatedTime: 8,
  },
  {
    id: "photo-puzzle",
    name: "Photo Puzzle",
    description: "Reconstruct family photos by arranging puzzle pieces",
    type: "puzzle",
    difficulty: "medium",
    icon: "🧩",
    estimatedTime: 10,
  },
  {
    id: "word-association",
    name: "Word Association",
    description: "Connect related words and concepts to strengthen semantic memory",
    type: "word",
    difficulty: "easy",
    icon: "📝",
    estimatedTime: 6,
  },
  {
    id: "spot-difference",
    name: "Spot the Difference",
    description: "Find differences between two similar images to enhance attention",
    type: "visual",
    difficulty: "medium",
    icon: "👁️",
    estimatedTime: 7,
  },
  {
    id: "story-builder",
    name: "Story Builder",
    description: "Create stories using memory prompts to exercise narrative memory",
    type: "word",
    difficulty: "hard",
    icon: "📚",
    estimatedTime: 12,
  },
  {
    id: "face-name-match",
    name: "Face-Name Match",
    description: "Match family member faces with their names",
    type: "matching",
    difficulty: "easy",
    icon: "👥",
    estimatedTime: 5,
  },
  {
    id: "timeline-sort",
    name: "Timeline Sort",
    description: "Arrange life events in chronological order",
    type: "sequence",
    difficulty: "hard",
    icon: "📅",
    estimatedTime: 15,
  },
]

export const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

export const gameTypeIcons = {
  matching: "🎯",
  sequence: "🔄",
  puzzle: "🧩",
  word: "💭",
  visual: "👁️",
}
