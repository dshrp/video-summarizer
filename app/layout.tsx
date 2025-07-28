import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Summarizer - AI-Powered Podcast Insights by Momentum",
  description:
    "Upload YouTube subtitle files and get AI-powered insights from podcasts. Extract key takeaways, notable questions, and actionable insights instantly. Built by Momentum to help creative communities learn and grow.",
  keywords: ["podcast", "summarizer", "AI", "YouTube", "subtitles", "insights", "transcript", "analysis", "Momentum"],
  authors: [{ name: "Momentum" }],
  creator: "Momentum",
  publisher: "Momentum",
  robots: "index, follow",

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://summarizer.thedscs.com",
    siteName: "Summarizer by Momentum",
    title: "Summarizer - AI-Powered Podcast Insights",
    description:
      "Transform YouTube podcast transcripts into actionable insights. Get key takeaways, notable Q&As, and practical advice from any podcast in seconds.",
    images: [
      {
        url: "/og-image.png", // We'll create this
        width: 1200,
        height: 630,
        alt: "Summarizer - AI-Powered Podcast Insights by Momentum",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@momentum", // Replace with actual Twitter handle if you have one
    creator: "@momentum",
    title: "Summarizer - AI-Powered Podcast Insights",
    description:
      "Transform YouTube podcast transcripts into actionable insights. Get key takeaways, notable Q&As, and practical advice from any podcast in seconds.",
    images: ["/og-image.png"],
  },

  // Additional metadata
  metadataBase: new URL("https://summarizer.thedscs.com"),
  alternates: {
    canonical: "https://summarizer.thedscs.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Summarizer" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Summarizer",
              description:
                "AI-powered podcast transcript analysis tool that extracts key insights from YouTube subtitle files",
              url: "https://summarizer.thedscs.com",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Momentum",
                url: "https://momentum.thedscs.com",
              },
            }),
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
