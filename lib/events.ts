export interface LifeEvent {
  id: number
  event: string
  year: number
  description: string
  correctOrder: number
  currentOrder: number
}

export const events: LifeEvent[] = [
  {
    id: 0,
    event: "Born",
    year: 1950,
    description: "Born in Springfield Hospital",
    correctOrder: 0,
    currentOrder: 0,
  },
  {
    id: 1,
    event: "Started School",
    year: 1956,
    description: "First day at Lincoln Elementary",
    correctOrder: 1,
    currentOrder: 1,
  },
  {
    id: 2,
    event: "High School Graduation",
    year: 1968,
    description: "Graduated from Springfield High",
    correctOrder: 2,
    currentOrder: 2,
  },
  {
    id: 3,
    event: "Got Married",
    year: 1972,
    description: "Wedding at St. Mary's Church",
    correctOrder: 3,
    currentOrder: 3,
  },
  {
    id: 4,
    event: "First Child Born",
    year: 1975,
    description: "Sarah was born",
    correctOrder: 4,
    currentOrder: 4,
  },
  {
    id: 5,
    event: "Bought First House",
    year: 1978,
    description: "Moved to Oak Street",
    correctOrder: 5,
    currentOrder: 5,
  },
  {
    id: 6,
    event: "Retirement",
    year: 2015,
    description: "Retired after 40 years of work",
    correctOrder: 6,
    currentOrder: 6,
  },
]
