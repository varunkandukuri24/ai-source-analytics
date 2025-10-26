"use server"

import { generateObject } from "ai"
import { z } from "zod"

const searchReferencesSchema = z.object({
  references: z.array(
    z.object({
      url: z.string().describe("The URL of the referenced website"),
      title: z.string().describe("The title of the webpage"),
      domain: z.string().describe("The domain name (e.g., nytimes.com)"),
      relevanceScore: z.number().min(0).max(100).describe("Relevance score from 0-100"),
      snippet: z.string().describe("A brief snippet or description of why this source is relevant"),
      category: z
        .enum(["news", "blog", "academic", "government", "commercial", "social", "other"])
        .describe("The category of the website"),
    }),
  ),
})

export interface SearchReference {
  url: string
  title: string
  domain: string
  relevanceScore: number
  snippet: string
  category: "news" | "blog" | "academic" | "government" | "commercial" | "social" | "other"
}

export interface AISearchResponse {
  provider: "openai" | "claude" | "gemini"
  references: SearchReference[]
  responseTime: number
  error?: string
}

export async function compareAIProviders(prompt: string): Promise<AISearchResponse[]> {
  const startTimes = {
    openai: Date.now(),
    claude: Date.now(),
    gemini: Date.now(),
  }

  const searchPrompt = `For the search query: "${prompt}"

Provide a ranked list of the top 8-12 most relevant websites and sources you would reference to answer this query. 
Include diverse, authoritative sources like news sites, academic papers, government resources, and reputable blogs.
Rank them by relevance score (0-100) with the most relevant first.`

  const results = await Promise.allSettled([
    // OpenAI GPT-4
    (async () => {
      try {
        const result = await generateObject({
          model: "openai/gpt-4.1",
          prompt: searchPrompt,
          schema: searchReferencesSchema,
        })

        return {
          provider: "openai" as const,
          references: result.object.references,
          responseTime: Date.now() - startTimes.openai,
        }
      } catch (error) {
        return {
          provider: "openai" as const,
          references: [],
          responseTime: Date.now() - startTimes.openai,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })(),

    // Anthropic Claude
    (async () => {
      try {
        const result = await generateObject({
          model: "anthropic/claude-sonnet-4.5",
          prompt: searchPrompt,
          schema: searchReferencesSchema,
        })

        return {
          provider: "claude" as const,
          references: result.object.references,
          responseTime: Date.now() - startTimes.claude,
        }
      } catch (error) {
        return {
          provider: "claude" as const,
          references: [],
          responseTime: Date.now() - startTimes.claude,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })(),

    // Google Gemini
    (async () => {
      try {
        const result = await generateObject({
          model: "google/gemini-2.5-flash",
          prompt: searchPrompt,
          schema: searchReferencesSchema,
        })

        return {
          provider: "gemini" as const,
          references: result.object.references,
          responseTime: Date.now() - startTimes.gemini,
        }
      } catch (error) {
        return {
          provider: "gemini" as const,
          references: [],
          responseTime: Date.now() - startTimes.gemini,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })(),
  ])

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value
    }
    return {
      provider: "openai" as const,
      references: [],
      responseTime: 0,
      error: "Request failed",
    }
  })
}
