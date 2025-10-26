"use server"

import { generateObject } from "ai"
import { z } from "zod"

const promptPanelSchema = z.object({
  queries: z.array(
    z.object({
      query: z.string().describe("A realistic user query"),
      intent: z.enum(["informational", "navigational", "transactional", "commercial"]),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),
})

const citationExtractionSchema = z.object({
  citations: z.array(
    z.object({
      query: z.string(),
      mentioned: z.boolean().describe("Whether the target website was mentioned"),
      rank: z.number().optional().describe("Ranking position if mentioned (1-10)"),
      sentiment: z.enum(["positive", "neutral", "negative"]).describe("Sentiment of the mention"),
      context: z.string().describe("How the website was mentioned"),
      competitorsMentioned: z.array(z.string()).describe("Competitor domains mentioned"),
    }),
  ),
})

const optimizationSchema = z.object({
  contentRecommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      impact: z.string(),
    }),
  ),
  technicalRecommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      impact: z.string(),
    }),
  ),
  offsiteRecommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      impact: z.string(),
    }),
  ),
})

const attributionSchema = z.object({
  topPages: z.array(
    z.object({
      url: z.string(),
      citationCount: z.number(),
      topics: z.array(z.string()),
      strength: z.enum(["strong", "moderate", "weak"]),
    }),
  ),
  contentGaps: z.array(
    z.object({
      topic: z.string(),
      description: z.string(),
      opportunity: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ),
})

export interface WebsiteAnalysisInput {
  targetWebsite: string
  focusTopics?: string[]
  competitors?: string[]
}

export interface PromptQuery {
  query: string
  intent: "informational" | "navigational" | "transactional" | "commercial"
  difficulty: "easy" | "medium" | "hard"
}

export interface CitationResult {
  query: string
  mentioned: boolean
  rank?: number
  sentiment: "positive" | "neutral" | "negative"
  context: string
  competitorsMentioned: string[]
}

export interface ModelCitationData {
  provider: "openai" | "claude" | "gemini"
  citations: CitationResult[]
  mentionRate: number
  averageRank: number
  sentimentBreakdown: { positive: number; neutral: number; negative: number }
}

export interface Recommendation {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  impact: string
}

export interface TopPage {
  url: string
  citationCount: number
  topics: string[]
  strength: "strong" | "moderate" | "weak"
}

export interface ContentGap {
  topic: string
  description: string
  opportunity: string
  priority: "high" | "medium" | "low"
}

export interface WebsiteAnalysisResult {
  targetWebsite: string
  promptPanel: PromptQuery[]
  modelResults: ModelCitationData[]
  optimization: {
    content: Recommendation[]
    technical: Recommendation[]
    offsite: Recommendation[]
  }
  attribution: {
    topPages: TopPage[]
    contentGaps: ContentGap[]
  }
  analysisTime: number
}

export async function analyzeWebsite(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisResult> {
  const startTime = Date.now()

  const promptPanelPrompt = `Generate 25-50 realistic user queries that people might use to discover or learn about ${input.targetWebsite}.

${input.focusTopics && input.focusTopics.length > 0 ? `Focus on these topics: ${input.focusTopics.join(", ")}` : ""}

Include a mix of:
- Informational queries (learning, understanding)
- Navigational queries (finding the website)
- Transactional queries (ready to use/buy)
- Commercial queries (comparing options)

Classify each query by intent and difficulty (easy/medium/hard based on how specific the query is).`

  const promptPanel = await generateObject({
    model: "openai/gpt-4.1",
    prompt: promptPanelPrompt,
    schema: promptPanelSchema,
  })

  const sampleQueries = promptPanel.object.queries.slice(0, 10) // Use first 10 queries for analysis

  const citationPrompt = (
    provider: string,
  ) => `For the website ${input.targetWebsite}, analyze how it would be mentioned in responses to these user queries:

${sampleQueries.map((q, i) => `${i + 1}. ${q.query}`).join("\n")}

${input.competitors && input.competitors.length > 0 ? `Also track mentions of these competitors: ${input.competitors.join(", ")}` : ""}

For each query, determine:
- Whether ${input.targetWebsite} would be mentioned
- If mentioned, what rank/position (1-10, where 1 is most prominent)
- Sentiment of the mention (positive, neutral, negative)
- Context of how it's mentioned
- Which competitors are also mentioned

Be realistic about ${provider}'s typical response patterns and citation behavior.`

  const [openaiCitations, claudeCitations, geminiCitations] = await Promise.all([
    generateObject({
      model: "openai/gpt-4.1",
      prompt: citationPrompt("OpenAI GPT-4"),
      schema: citationExtractionSchema,
    }),
    generateObject({
      model: "anthropic/claude-sonnet-4.5",
      prompt: citationPrompt("Anthropic Claude"),
      schema: citationExtractionSchema,
    }),
    generateObject({
      model: "google/gemini-2.5-flash",
      prompt: citationPrompt("Google Gemini"),
      schema: citationExtractionSchema,
    }),
  ])

  const processModelData = (
    provider: "openai" | "claude" | "gemini",
    citations: CitationResult[],
  ): ModelCitationData => {
    const mentioned = citations.filter((c) => c.mentioned)
    const mentionRate = (mentioned.length / citations.length) * 100
    const averageRank =
      mentioned.length > 0 ? mentioned.reduce((sum, c) => sum + (c.rank || 10), 0) / mentioned.length : 0

    const sentimentBreakdown = {
      positive: citations.filter((c) => c.sentiment === "positive").length,
      neutral: citations.filter((c) => c.sentiment === "neutral").length,
      negative: citations.filter((c) => c.sentiment === "negative").length,
    }

    return {
      provider,
      citations,
      mentionRate,
      averageRank,
      sentimentBreakdown,
    }
  }

  const modelResults = [
    processModelData("openai", openaiCitations.object.citations),
    processModelData("claude", claudeCitations.object.citations),
    processModelData("gemini", geminiCitations.object.citations),
  ]

  const optimizationPrompt = `Based on the citation analysis for ${input.targetWebsite}, provide actionable recommendations to improve AI search visibility.

Current Performance:
- OpenAI mention rate: ${modelResults[0].mentionRate.toFixed(1)}%
- Claude mention rate: ${modelResults[1].mentionRate.toFixed(1)}%
- Gemini mention rate: ${modelResults[2].mentionRate.toFixed(1)}%

Provide specific recommendations in three categories:
1. Content Recommendations - What content to create, improve, or optimize
2. Technical Recommendations - Technical SEO, structured data, site architecture
3. Offsite Recommendations - Link building, partnerships, PR strategies

For each recommendation, include:
- Clear title
- Detailed description
- Priority (high/medium/low)
- Expected impact

Focus on actionable, specific advice that can improve AI model citations.`

  const optimization = await generateObject({
    model: "openai/gpt-4.1",
    prompt: optimizationPrompt,
    schema: optimizationSchema,
  })

  const attributionPrompt = `For ${input.targetWebsite}, identify:

1. Top Pages - Which pages/URLs are most likely to be cited by AI models
   - Estimate citation count
   - Identify topics covered
   - Rate strength (strong/moderate/weak)

2. Content Gaps - Topics where the website is underperforming or missing
   - Identify the gap
   - Explain why it matters
   - Describe the opportunity
   - Set priority

${input.focusTopics && input.focusTopics.length > 0 ? `Focus areas: ${input.focusTopics.join(", ")}` : ""}

Base this on typical website structures and the citation patterns observed.`

  const attribution = await generateObject({
    model: "openai/gpt-4.1",
    prompt: attributionPrompt,
    schema: attributionSchema,
  })

  return {
    targetWebsite: input.targetWebsite,
    promptPanel: promptPanel.object.queries,
    modelResults,
    optimization: {
      content: optimization.object.contentRecommendations,
      technical: optimization.object.technicalRecommendations,
      offsite: optimization.object.offsiteRecommendations,
    },
    attribution: {
      topPages: attribution.object.topPages,
      contentGaps: attribution.object.contentGaps,
    },
    analysisTime: Date.now() - startTime,
  }
}
