"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fefcf6" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fefcf6" }}>
      <Card className="max-w-md w-full bg-white border-2 border-gray-900 shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <p className="text-gray-700">Your donation means the world to us</p>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          {session && (
            <p className="text-lg font-semibold text-blue-600 mb-6">
              ${(session.amount_total / 100).toFixed(2)} donated successfully
            </p>
          )}
          <p className="text-gray-600 mb-8">
            Your support helps us continue building tools that bring creative communities together.
          </p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Summarizer
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
