"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Memory } from "@/lib/types"
import { generateAITags } from "@/lib/ai-utils"

interface UploadMemoryFormProps {
  onAddMemory: (memory: Memory) => void
}

export function UploadMemoryForm({ onAddMemory }: UploadMemoryFormProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "family",
    imageFile: null as File | null,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, imageFile: file }))

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // For the prototype, we'll simulate AI tagging
      const aiTags = await generateAITags(formData.title, formData.description)

      // Create a new memory object
      const newMemory: Memory = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date || new Date().toISOString().split("T")[0],
        category: formData.category,
        imageUrl: previewUrl || "/placeholder.svg?height=400&width=600",
        aiTags: aiTags,
        aiCaption: `This appears to be ${formData.title.toLowerCase()}, which took place on ${formData.date || "an unknown date"}.`,
        quizQuestions: [
          {
            id: "q1",
            question: `Who was present at ${formData.title}?`,
            options: ["Family members", "Friends", "Colleagues", "I don't remember"],
            correctAnswer: "Family members",
          },
          {
            id: "q2",
            question: `When did this event take place?`,
            options: [
              "Last year",
              "Many years ago",
              formData.date ? `On ${formData.date}` : "Recently",
              "I don't remember",
            ],
            correctAnswer: formData.date ? `On ${formData.date}` : "Recently",
          },
        ],
      }

      // Add the memory
      onAddMemory(newMemory)

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        category: "family",
        imageFile: null,
      })
      setPreviewUrl(null)

      toast({
        title: "Memory added!",
        description: "Your memory has been successfully uploaded and processed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem uploading your memory.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Memory Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Family Vacation to Hawaii"
          required
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe this memory..."
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date (Optional)</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleSelectChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="celebration">Celebration</SelectItem>
              <SelectItem value="milestone">Milestone</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />

        {previewUrl && (
          <div className="mt-2 border rounded-md overflow-hidden">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isUploading}>
        {isUploading ? "Processing..." : "Upload Memory"}
      </Button>
    </form>
  )
}
