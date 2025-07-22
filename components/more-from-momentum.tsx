import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Instagram, Calendar } from "lucide-react"
import Link from "next/link"

export function MoreFromMomentum() {
  return (
    <Card className="bg-blue-50 border-2 border-gray-900 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          {/* Left side: Image/Visual */}
          <div className="bg-blue-600 p-10 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-white/10 p-6 rounded-full inline-flex mb-4">
                <Calendar className="h-16 w-16 text-white" />
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <Instagram className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Never miss an event</span>
              </div>
            </div>
          </div>

          {/* Right side: Content */}
          <div className="p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More from Momentum</h2>
            <p className="text-gray-700 mb-6">
              Discover events you're missing on Instagram. Momentum helps you see creative community events buried by
              the algorithm, all in one place.
            </p>
            <Link href="https://momentum.thedscs.com/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-gray-900 w-full">
                Visit Momentum
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
