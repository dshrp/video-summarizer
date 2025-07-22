import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  children?: React.ReactNode
  className?: string
}

export function FeatureCard({ title, description, children, className }: FeatureCardProps) {
  return (
    <Card className={`bg-blue-50/70 border-2 border-gray-900 shadow-md ${className}`}>
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">{description}</p>
        {children}
      </CardContent>
    </Card>
  )
}
