"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"
import type { Memory } from "@/lib/types"
import Link from "next/link"

interface MemoryListProps {
  memories: Memory[]
  isEditable?: boolean
}

export function MemoryList({ memories, isEditable = false }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-medium mb-2">No memories yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Upload your first memory to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memories.map((memory) => (
        <Card key={memory.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={memory.imageUrl || "/placeholder.svg"}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{memory.title}</CardTitle>
              <Badge variant="outline">{memory.category}</Badge>
            </div>
            <p className="text-sm text-gray-500">{memory.date}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm line-clamp-2">{memory.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {memory.aiTags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Link href={`/dashboard/patient?memory=${memory.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>

            {isEditable && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
