import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

// Maximum characters to send to OpenAI
const MAX_CHARS = 40000

function preprocessTranscript(rawTranscript: string): string {
  let processed = rawTranscript

  // Remove timestamp patterns (common in subtitle files)
  processed = processed.replace(/\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}/g, "")
  processed = processed.replace(/^\d+$/gm, "") // Remove subtitle sequence numbers
  processed = processed.replace(/\[.*?\]/g, "") // Remove [speaker] or [music] tags
  processed = processed.replace(/<.*?>/g, "") // Remove HTML-like tags
  processed = processed.replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
  processed = processed.replace(/^\s*$/gm, "") // Remove empty lines
  processed = processed.trim()

  return processed
}

export async function POST(req: NextRequest) {
  console.log("=== Summarize API Called ===")

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key")
    return NextResponse.json(
      {
        error: "OpenAI API key is missing. Please contact support.",
      },
      { status: 500 },
    )
  }

  try {
    const body = await req.json()
    console.log("Request body received")

    const { transcript } = body

    if (!transcript || typeof transcript !== "string") {
      console.error("Invalid transcript:", typeof transcript)
      return NextResponse.json({ error: "Invalid transcript provided" }, { status: 400 })
    }

    console.log(`Original transcript length: ${transcript.length} characters`)

    // Preprocess the transcript to clean up subtitle formatting
    let processedTranscript = preprocessTranscript(transcript)
    console.log(`Processed transcript length: ${processedTranscript.length} characters`)

    // If still too long, truncate
    if (processedTranscript.length > MAX_CHARS) {
      console.log("Truncating transcript due to length")
      processedTranscript = processedTranscript.substring(0, MAX_CHARS)
      processedTranscript += "\n\n[Note: Transcript was truncated due to length]"
    }

    // Ensure we have meaningful content
    if (processedTranscript.length < 100) {
      console.error("Transcript too short after processing")
      return NextResponse.json(
        { error: "The transcript appears to be too short or contains no meaningful content." },
        { status: 400 },
      )
    }

    console.log("Starting OpenAI generation...")

    const prompt = `You are an expert content analyst. Analyze this podcast/interview transcript and extract key insights.

TRANSCRIPT:
${processedTranscript}

Respond with a JSON object containing:
- takeaways: Array of 5-8 key insights or lessons
- questions: Array of 4-6 objects with "question" and "answer" fields for notable Q&A exchanges
- keyTopics: Array of 6-10 main topics (1-3 words each)
- actionableInsights: Array of 3-5 practical recommendations

Focus on the most valuable and memorable content. Keep answers concise but meaningful.

Respond only with valid JSON:`

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: "You are a professional content analyst. Always respond with valid JSON.",
        prompt,
        temperature: 0.2,
        maxTokens: 3000,
      })

      console.log("OpenAI response received, length:", text.length)

      // Clean and parse JSON response
      let cleanedText = text.trim()

      // Remove markdown code fences if present
      if (cleanedText.startsWith("```")) {
        const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (match?.[1]) {
          cleanedText = match[1].trim()
        }
      }

      console.log("Attempting to parse JSON...")
      let parsedResult

      try {
        parsedResult = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Raw response:", text.substring(0, 500))

        // Try to fix common JSON issues
        const fixedText = cleanedText
          .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to keys

        try {
          parsedResult = JSON.parse(fixedText)
          console.log("JSON fixed and parsed successfully")
        } catch (secondError) {
          console.error("Second parse attempt failed:", secondError)
          throw new Error("Unable to parse AI response as valid JSON")
        }
      }

      // Validate structure
      const requiredFields = ["takeaways", "questions", "keyTopics", "actionableInsights"]
      for (const field of requiredFields) {
        if (!parsedResult[field] || !Array.isArray(parsedResult[field])) {
          console.error(`Missing or invalid field: ${field}`)
          throw new Error(`Invalid response structure: missing ${field}`)
        }
      }

      // Validate questions structure
      if (parsedResult.questions.some((q: any) => !q.question || !q.answer)) {
        console.error("Invalid questions structure")
        throw new Error("Invalid questions format in response")
      }

      console.log("Response validation successful")
      return NextResponse.json(parsedResult)
    } catch (aiError: any) {
      console.error("OpenAI generation error:", aiError)

      // Return a more specific error message
      if (aiError.message?.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please wait a moment and try again." }, { status: 429 })
      } else if (aiError.message?.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timed out. Please try again with a shorter transcript." },
          { status: 408 },
        )
      } else {
        return NextResponse.json(
          { error: "Failed to analyze transcript. The content may be too complex or in an unsupported format." },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error("General API error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    )
  }
}
