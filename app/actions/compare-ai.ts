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
      estimatedTokens: z.number().describe("Estimated number of tokens read from this reference"),
      publishDate: z.string().optional().describe("Publication date if available (YYYY-MM-DD)"),
      authorityScore: z.number().min(0).max(100).describe("Domain authority score from 0-100"),
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
  estimatedTokens: number
  publishDate?: string
  authorityScore: number
}

export interface AISearchResponse {
  provider: "openai" | "claude" | "gemini"
  references: SearchReference[]
  responseTime: number
  totalTokensUsed: number
  totalTokensRead: number
  averageAuthorityScore: number
  sourceDiversity: number
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
Rank them by relevance score (0-100) with the most relevant first.

For each reference, also provide:
- Estimated number of tokens you would read from that source (typically 500-3000 tokens per article)
- Domain authority score (0-100, based on the site's reputation and trustworthiness)
- Publication date if it's a time-sensitive source (use YYYY-MM-DD format)
- Category (news, blog, academic, government, commercial, social, or other)`

  const results = await Promise.allSettled([
    // OpenAI GPT-4
    (async () => {
      try {
        const result = await generateObject({
          model: "openai/gpt-4.1",
          prompt: searchPrompt,
          schema: searchReferencesSchema,
        })

        const totalTokensRead = result.object.references.reduce((sum, ref) => sum + ref.estimatedTokens, 0)
        const avgAuthority =
          result.object.references.length > 0
            ? result.object.references.reduce((sum, ref) => sum + ref.authorityScore, 0) /
              result.object.references.length
            : 0
        const uniqueDomains = new Set(result.object.references.map((ref) => ref.domain)).size
        const sourceDiversity =
          result.object.references.length > 0 ? (uniqueDomains / result.object.references.length) * 100 : 0

        return {
          provider: "openai" as const,
          references: result.object.references,
          responseTime: Date.now() - startTimes.openai,
          totalTokensUsed: result.usage?.totalTokens || 0,
          totalTokensRead,
          averageAuthorityScore: avgAuthority,
          sourceDiversity,
        }
      } catch (error) {
        return {
          provider: "openai" as const,
          references: [],
          responseTime: Date.now() - startTimes.openai,
          totalTokensUsed: 0,
          totalTokensRead: 0,
          averageAuthorityScore: 0,
          sourceDiversity: 0,
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

        const totalTokensRead = result.object.references.reduce((sum, ref) => sum + ref.estimatedTokens, 0)
        const avgAuthority =
          result.object.references.length > 0
            ? result.object.references.reduce((sum, ref) => sum + ref.authorityScore, 0) /
              result.object.references.length
            : 0
        const uniqueDomains = new Set(result.object.references.map((ref) => ref.domain)).size
        const sourceDiversity =
          result.object.references.length > 0 ? (uniqueDomains / result.object.references.length) * 100 : 0

        return {
          provider: "claude" as const,
          references: result.object.references,
          responseTime: Date.now() - startTimes.claude,
          totalTokensUsed: result.usage?.totalTokens || 0,
          totalTokensRead,
          averageAuthorityScore: avgAuthority,
          sourceDiversity,
        }
      } catch (error) {
        return {
          provider: "claude" as const,
          references: [],
          responseTime: Date.now() - startTimes.claude,
          totalTokensUsed: 0,
          totalTokensRead: 0,
          averageAuthorityScore: 0,
          sourceDiversity: 0,
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

        const totalTokensRead = result.object.references.reduce((sum, ref) => sum + ref.estimatedTokens, 0)
        const avgAuthority =
          result.object.references.length > 0
            ? result.object.references.reduce((sum, ref) => sum + ref.authorityScore, 0) /
              result.object.references.length
            : 0
        const uniqueDomains = new Set(result.object.references.map((ref) => ref.domain)).size
        const sourceDiversity =
          result.object.references.length > 0 ? (uniqueDomains / result.object.references.length) * 100 : 0

        return {
          provider: "gemini" as const,
          references: result.object.references,
          responseTime: Date.now() - startTimes.gemini,
          totalTokensUsed: result.usage?.totalTokens || 0,
          totalTokensRead,
          averageAuthorityScore: avgAuthority,
          sourceDiversity,
        }
      } catch (error) {
        return {
          provider: "gemini" as const,
          references: [],
          responseTime: Date.now() - startTimes.gemini,
          totalTokensUsed: 0,
          totalTokensRead: 0,
          averageAuthorityScore: 0,
          sourceDiversity: 0,
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
      totalTokensUsed: 0,
      totalTokensRead: 0,
      averageAuthorityScore: 0,
      sourceDiversity: 0,
      error: "Request failed",
    }
  })
}
