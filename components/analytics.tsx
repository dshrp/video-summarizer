"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GA_ID) return

    // Wait for gtag to be available
    const trackPageView = () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
          page_path: pathname + searchParams.toString(),
        })
      }
    }

    // Small delay to ensure gtag is loaded
    const timer = setTimeout(trackPageView, 100)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  // Don't render anything if no GA ID
  if (!process.env.NEXT_PUBLIC_GA_ID) return null

  return null
}

// Custom event tracking functions you can use throughout your app
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters)
  }
}

// Specific tracking functions for your app
export const trackFileUpload = (fileType: string, fileSize: number) => {
  trackEvent("file_upload", {
    file_type: fileType,
    file_size_kb: Math.round(fileSize / 1024),
  })
}

export const trackSummaryGenerated = (success: boolean, processingTime?: number) => {
  trackEvent("summary_generated", {
    success,
    processing_time_ms: processingTime,
  })
}

export const trackDonationClick = (amount: number) => {
  trackEvent("donation_initiated", {
    value: amount,
    currency: "USD",
  })
}

export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent("external_link_click", {
    link_url: url,
    link_text: linkText,
  })
}
