// This is a mock implementation for the prototype
// In a real implementation, this would call an AI service

export async function generateAITags(title: string, description: string): Promise<string[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Extract keywords from title and description
  const combinedText = `${title} ${description}`.toLowerCase()

  // Simple keyword extraction based on common categories
  const possibleTags = [
    "family",
    "vacation",
    "birthday",
    "anniversary",
    "graduation",
    "wedding",
    "holiday",
    "celebration",
    "milestone",
    "reunion",
    "party",
    "trip",
    "beach",
    "mountains",
    "lake",
    "outdoors",
    "dinner",
    "lunch",
    "breakfast",
    "picnic",
    "barbecue",
    "gathering",
    "friends",
    "relatives",
    "children",
    "parents",
    "grandparents",
    "summer",
    "winter",
    "fall",
    "spring",
    "christmas",
    "thanksgiving",
    "new year",
    "easter",
    "halloween",
    "memorial",
    "achievement",
  ]

  // Find matching tags
  const matchedTags = possibleTags.filter((tag) => combinedText.includes(tag))

  // Add some context-based tags
  const contextTags: string[] = []

  if (
    combinedText.includes("beach") ||
    combinedText.includes("ocean") ||
    combinedText.includes("sea") ||
    combinedText.includes("hawaii")
  ) {
    contextTags.push("beach", "ocean")
  }

  if (combinedText.includes("mountain") || combinedText.includes("hiking") || combinedText.includes("trail")) {
    contextTags.push("mountains", "hiking")
  }

  if (
    combinedText.includes("cake") ||
    combinedText.includes("party") ||
    combinedText.includes("celebration") ||
    combinedText.includes("birthday")
  ) {
    contextTags.push("celebration", "party")
  }

  // Combine and deduplicate tags
  const allTags = [...new Set([...matchedTags, ...contextTags])]

  // Return 3-5 tags
  return allTags.slice(0, Math.min(5, allTags.length))
}
