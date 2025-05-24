import type { Memory } from "./types"

export const mockMemories: Memory[] = [
  {
    id: "1",
    title: "Family Reunion 2019",
    description: "Our annual family reunion at Lake Michigan. Everyone was there, including Grandma and Grandpa Smith.",
    date: "2019-07-15",
    category: "family",
    imageUrl: "/placeholder.svg?height=400&width=600",
    aiTags: ["family", "outdoors", "lake", "summer", "reunion"],
    aiCaption:
      "This appears to be a family gathering at a lake. Multiple generations are present, including elderly individuals who might be grandparents. The setting suggests a summer reunion.",
    quizQuestions: [
      {
        id: "q1",
        question: "Where was this family reunion held?",
        options: ["Lake Michigan", "Lake Superior", "Ocean Beach", "Mountain Retreat"],
        correctAnswer: "Lake Michigan",
      },
      {
        id: "q2",
        question: "Who was present at this reunion?",
        options: ["Just immediate family", "Grandma and Grandpa Smith", "Only the children", "Neighbors and friends"],
        correctAnswer: "Grandma and Grandpa Smith",
      },
    ],
  },
  {
    id: "2",
    title: "Sarah's Graduation",
    description:
      "Sarah's college graduation ceremony at State University. She received her Bachelor's degree in Computer Science.",
    date: "2021-05-22",
    category: "milestone",
    imageUrl: "/placeholder.svg?height=400&width=600",
    aiTags: ["graduation", "ceremony", "achievement", "education", "celebration"],
    aiCaption:
      "This image shows a graduation ceremony, likely at State University. A young woman in graduation attire appears to be receiving a diploma or certificate.",
    quizQuestions: [
      {
        id: "q1",
        question: "What degree did Sarah receive?",
        options: [
          "Bachelor's in Computer Science",
          "Master's in Engineering",
          "PhD in Mathematics",
          "Bachelor's in Business",
        ],
        correctAnswer: "Bachelor's in Computer Science",
      },
      {
        id: "q2",
        question: "Where did Sarah graduate from?",
        options: ["Community College", "State University", "Private Academy", "Technical Institute"],
        correctAnswer: "State University",
      },
    ],
  },
  {
    id: "3",
    title: "Hawaii Vacation 2018",
    description:
      "Our family trip to Hawaii. We visited Maui and Oahu, went snorkeling, and attended a traditional luau.",
    date: "2018-08-10",
    category: "vacation",
    imageUrl: "/placeholder.svg?height=400&width=600",
    aiTags: ["vacation", "beach", "tropical", "hawaii", "family trip"],
    aiCaption:
      "This image shows a tropical beach setting, likely in Hawaii. There appears to be a family enjoying beach activities with palm trees and ocean visible in the background.",
    quizQuestions: [
      {
        id: "q1",
        question: "Which islands did we visit in Hawaii?",
        options: ["Maui and Oahu", "Kauai and Big Island", "Lanai and Molokai", "All Hawaiian islands"],
        correctAnswer: "Maui and Oahu",
      },
      {
        id: "q2",
        question: "What special event did we attend in Hawaii?",
        options: ["Wedding", "Traditional luau", "Music festival", "Surfing competition"],
        correctAnswer: "Traditional luau",
      },
    ],
  },
  {
    id: "4",
    title: "Dad's 60th Birthday",
    description:
      "Surprise party for Dad's 60th birthday. We had it at his favorite restaurant and all his friends came.",
    date: "2020-11-05",
    category: "celebration",
    imageUrl: "/placeholder.svg?height=400&width=600",
    aiTags: ["birthday", "celebration", "family", "party", "surprise"],
    aiCaption:
      "This appears to be a birthday celebration for an older man, likely in his 60s. There's a cake with candles and people gathered around in what looks like a restaurant setting.",
    quizQuestions: [
      {
        id: "q1",
        question: "What birthday was Dad celebrating?",
        options: ["50th", "60th", "65th", "70th"],
        correctAnswer: "60th",
      },
      {
        id: "q2",
        question: "Where was the party held?",
        options: ["At home", "In a park", "At his favorite restaurant", "Community center"],
        correctAnswer: "At his favorite restaurant",
      },
    ],
  },
]
