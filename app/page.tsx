"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Loader2, CheckCircle, Zap, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { DonationSection } from "@/components/donation-section"
import { FeatureCard } from "@/components/feature-card"
import Head from "next/head"
import { MoreFromMomentum } from "@/components/more-from-momentum"

interface SummaryResult {
  takeaways: string[]
  questions: Array<{
    question: string
    answer: string
  }>
  keyTopics: string[]
  actionableInsights: string[]
}

export default function PodcastSummarizer() {
  const [file, setFile] = useState<File | null>(null)
  const [fileText, setFileText] = useState("")
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setError("")
    setSummary(null)
    setRetryCount(0)

    // Check file type
    const validTypes = ["text/plain", "application/x-subrip", "text/x-subrip"]
    const fileName = selectedFile.name || ""
    const fileExt = fileName.split(".").pop()?.toLowerCase() || ""

    if (!validTypes.includes(selectedFile.type) && !["txt", "srt", "vtt"].includes(fileExt)) {
      setError("Please upload a .txt, .srt, or .vtt subtitle file")
      return
    }

    // Check file size (max 1MB)
    if (selectedFile.size > 1024 * 1024) {
      setError("File is too large. Please upload a file smaller than 1MB.")
      return
    }

    setFile(selectedFile)

    try {
      const text = await selectedFile.text()
      if (!text || text.trim().length < 50) {
        setError("The file appears to be empty or too short. Please upload a valid subtitle file.")
        return
      }
      setFileText(text)
    } catch (err) {
      console.error("Error reading file:", err)
      setError("Error reading file. Please try again with a different file.")
    }
  }

  const handleSummarize = async () => {
    if (!fileText) return

    setLoading(true)
    setError("")

    try {
      console.log("Sending request to API...")

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: fileText }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const result = await response.json()
      console.log("Summary generated successfully")
      setSummary(result)
      setRetryCount(0)
    } catch (err: any) {
      console.error("Summary error:", err)
      setRetryCount((prev) => prev + 1)

      let errorMessage = "Failed to generate summary. "

      if (err.message?.includes("rate limit")) {
        errorMessage += "Rate limit exceeded. Please wait a moment before trying again."
      } else if (err.message?.includes("timeout")) {
        errorMessage += "Request timed out. Try with a shorter transcript."
      } else if (err.message?.includes("JSON")) {
        errorMessage += "There was an issue processing the response. Please try again."
      } else {
        errorMessage += err.message || "Please try again."
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetApp = () => {
    setFile(null)
    setFileText("")
    setSummary(null)
    setError("")
    setRetryCount(0)
  }

  return (
    <>
      <Head>
        {/* Additional page-specific meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: "#fefcf6" }}>
        <div className="max-w-4xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-2 border-gray-900">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Summarizer</h1>
            </div>
          </div>

          {/* Feature Card */}
          <FeatureCard
            title="Upload YouTube subtitle files to get AI-powered insights."
            description="Summarizer automatically extracts key insights from podcasts—so you never have to worry about missing important information again. Made with love by Momentum."
          />

          {/* File Upload Section */}
          <Card className="mt-16 mb-16 bg-white border-2 border-gray-900 shadow-md">
            <CardHeader className="border-b border-gray-200 px-8 py-6">
              <CardTitle className="flex items-center gap-3 text-gray-900 text-xl">
                <Upload className="h-5 w-5" />
                Upload Subtitle File
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                      file ? "border-blue-300 bg-blue-50" : "border-gray-900 bg-gray-50 hover:bg-gray-100",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {file ? (
                        <>
                          <CheckCircle className="w-12 h-12 mb-4 text-blue-600" />
                          <p className="text-sm text-blue-700 font-medium">{file.name}</p>
                          <p className="text-xs text-blue-600 mt-1">{Math.round(file.size / 1024)} KB</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-12 h-12 mb-4 text-gray-400" />
                          <p className="mb-2 text-lg text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">TXT, SRT, or VTT subtitle files (max 1MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".txt,.srt,.vtt,text/plain,application/x-subrip"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {error && (
                  <div className="text-red-700 text-sm bg-red-50 border-2 border-red-200 p-4 rounded-md flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{error}</p>
                      {retryCount > 0 && <p className="text-xs mt-1 text-red-600">Attempt {retryCount} failed</p>}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSummarize}
                    disabled={!fileText || loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-2 border-gray-900 py-6 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing transcript...
                      </>
                    ) : (
                      <>
                        {retryCount > 0 && <RefreshCw className="mr-2 h-5 w-5" />}
                        Generate Summary
                      </>
                    )}
                  </Button>
                  {(file || summary) && (
                    <Button
                      variant="outline"
                      onClick={resetApp}
                      className="border-2 border-gray-900 text-gray-700 hover:bg-gray-50 bg-white py-6 text-lg"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Results */}
          {summary && (
            <div className="space-y-16">
              <Card className="bg-white border-2 border-gray-900 shadow-md">
                <CardHeader className="border-b border-gray-200 px-8 py-6">
                  <CardTitle className="text-gray-900 text-xl">Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    {summary.takeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium border border-blue-200">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-900 shadow-md">
                <CardHeader className="border-b border-gray-200 px-8 py-6">
                  <CardTitle className="text-gray-900 text-xl">Notable Questions & Answers</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {summary.questions.map((qa, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-6 py-4 bg-blue-50/30 rounded-r-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-blue-600 font-semibold">Q:</span>
                          <span className="text-gray-900 font-medium leading-relaxed">{qa.question}</span>
                        </div>
                        <div className="flex items-start gap-3 ml-6">
                          <span className="text-blue-600 font-semibold">A:</span>
                          <span className="text-gray-700 leading-relaxed">{qa.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-16">
                <Card className="bg-white border-2 border-gray-900 shadow-md">
                  <CardHeader className="border-b border-gray-200 px-8 py-6">
                    <CardTitle className="text-gray-900 text-xl">Key Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex flex-wrap gap-3">
                      {summary.keyTopics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-gray-900 shadow-md">
                  <CardHeader className="border-b border-gray-200 px-8 py-6">
                    <CardTitle className="text-gray-900 text-xl">Actionable Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ul className="space-y-3">
                      {summary.actionableInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-600 font-bold">•</span>
                          <span className="text-gray-700 leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Instructions */}
          <Card className="mt-16 mb-16 bg-white border-2 border-gray-900 shadow-md">
            <CardContent className="p-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">How to use:</h3>
              <ol className="text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium border border-gray-200">
                    1
                  </span>
                  Go to{" "}
                  <a
                    href="https://downsub.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    downsub.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium border border-gray-200">
                    2
                  </span>
                  Paste your YouTube video URL and download the subtitle file
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium border border-gray-200">
                    3
                  </span>
                  Upload the subtitle file here
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium border border-gray-200">
                    4
                  </span>
                  Click "Generate Summary" to get AI-powered insights
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* More from Momentum Section */}
          <div className="mt-16 mb-16">
            <MoreFromMomentum />
          </div>

          {/* Donation Section */}
          <div className="mt-16">
            <DonationSection />
          </div>
        </div>
      </div>
    </>
  )
}
