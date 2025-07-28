"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackDonationClick } from "./analytics"

const PRESET_AMOUNTS = [5, 10, 25]

export function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(0)
  }

  const getCurrentAmount = () => {
    return customAmount ? Number.parseFloat(customAmount) || 0 : selectedAmount
  }

  const handleDonate = async () => {
    const amount = getCurrentAmount()
    if (amount < 1) return

    // Track donation attempt
    trackDonationClick(amount)

    setLoading(true)
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Math.round(amount * 100) }), // Convert to cents
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-yellow-50 border-2 border-gray-900 shadow-lg">
      <CardContent className="p-10 text-center">
        <div className="mb-8">
          <Heart className="w-10 h-10 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brought to you by Momentum</h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            <br />
            Momentum is a passion project built to help creative communities learn, grow, and stay connected. If it's
            helping you discover and learn more about today's creative ecosystem and more, consider supporting its
            continued development.
          </p>
        </div>

        <div className="space-y-8">
          {/* Preset Amount Buttons */}
          <div className="flex justify-center gap-6">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                className={cn(
                  "px-10 py-6 text-lg font-semibold rounded-full border-2 border-gray-900",
                  selectedAmount === amount
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-900 hover:bg-gray-50",
                )}
                onClick={() => handleAmountSelect(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="max-w-md mx-auto">
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="text-center text-lg py-6 rounded-full border-2 border-gray-900 bg-white"
              min="1"
              step="0.01"
            />
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={getCurrentAmount() < 1 || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg font-semibold rounded-full border-2 border-gray-900 shadow-lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            {loading ? "Processing..." : `Donate $${getCurrentAmount()}`}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Footer Text */}
          <p className="text-sm text-gray-600 mt-4">
            Secure payment processing powered by Stripe • Live payments enabled
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
