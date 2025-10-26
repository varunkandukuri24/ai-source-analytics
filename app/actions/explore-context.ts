"use server"

import { generateText } from "ai"
import { z } from "zod"

const ReferenceSchema = z.object({
  url: z.string(),
  title: z.string(),
  domain: z.string(),
  relevanceScore: z.number().min(0).max(100),
  snippet: z.string(),
  tokensRead: z.number(),
  category: z.enum(["news", "blog", "academic", "official", "community", "commercial"]),
})

const ContextVariantSchema = z.object({
  context: z.string(),
  contextType: z.enum(["persona", "temporal", "geographic", "tone"]),
  query: z.string(),
})

const ModelContextResultSchema = z.object({
  provider: z.string(),
  references: z.array(ReferenceSchema),
  responseTime: z.number(),
  totalTokens: z.number(),
  tokensReadFromContent: z.number(),
})

export type Reference = z.infer<typeof ReferenceSchema>
export type ContextVariant = z.infer<typeof ContextVariantSchema>
export type ModelContextResult = z.infer<typeof ModelContextResultSchema>

export interface ContextExplorationResult {
  baseQuery: string
  variants: ContextVariant[]
  results: {
    [variantIndex: number]: ModelContextResult[]
  }
  insights: {
    mostStableModel: string
    mostDriftCausingContext: string
    averageCitationOverlap: number
    topDomains: { domain: string; frequency: number }[]
    contextSensitivityScore: number
  }
}

function stripMarkdownCodeBlocks(text: string): string {
  // Remove markdown code blocks (\`\`\`json ... \`\`\` or \`\`\` ... \`\`\`)
  return text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim()
}

function parseAIJsonResponse(text: string): any {
  // Step 1: Strip markdown code blocks
  let cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim()

  // Step 2: Try parsing as-is first
  try {
    return JSON.parse(cleaned)
  } catch (firstError) {
    // Step 3: Try fixing common JSON errors
    try {
      // Remove trailing commas before } or ]
      cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1")

      // Remove comments (// and /* */)
      cleaned = cleaned.replace(/\/\/.*$/gm, "")
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "")

      // Fix single quotes to double quotes (but be careful with apostrophes in content)
      cleaned = cleaned.replace(/'([^']*?)'/g, '"$1"')

      // Remove any trailing commas after the last property
      cleaned = cleaned.replace(/,(\s*})/g, "$1")
      cleaned = cleaned.replace(/,(\s*])/g, "$1")

      return JSON.parse(cleaned)
    } catch (secondError) {
      // Step 4: Try to extract JSON array or object from the text
      try {
        const arrayMatch = cleaned.match(/\[[\s\S]*\]/)
        if (arrayMatch) {
          let extracted = arrayMatch[0]
          // Fix trailing commas in extracted JSON
          extracted = extracted.replace(/,(\s*[}\]])/g, "$1")
          return JSON.parse(extracted)
        }

        const objectMatch = cleaned.match(/\{[\s\S]*\}/)
        if (objectMatch) {
          let extracted = objectMatch[0]
          // Fix trailing commas in extracted JSON
          extracted = extracted.replace(/,(\s*[}\]])/g, "$1")
          return JSON.parse(extracted)
        }
      } catch (thirdError) {
        console.error("[v0] All JSON parsing attempts failed:", {
          original: text.substring(0, 200),
          cleaned: cleaned.substring(0, 200),
          firstError: firstError instanceof Error ? firstError.message : String(firstError),
          secondError: secondError instanceof Error ? secondError.message : String(secondError),
          thirdError: thirdError instanceof Error ? thirdError.message : String(thirdError),
        })
      }
    }
  }

  // If all parsing attempts fail, throw the original error
  throw new Error("Failed to parse AI response as JSON")
}

async function generateContextVariants(baseQuery: string): Promise<ContextVariant[]> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Generate 8 contextual variants of this base query: "${baseQuery}"

Create exactly 2 variants for each context type:
1. Persona variations (e.g., "I'm a student on a budget", "I'm a professional researcher")
2. Temporal variations (e.g., "in 2023", "as of 2025", "for the next decade")
3. Geographic variations (e.g., "in the United States", "in Europe", "in Asia")
4. Tone variations (e.g., "casual tone", "technical report style", "beginner-friendly")

Return ONLY a JSON array with this exact structure:
[
  {
    "context": "Brief description of the context",
    "contextType": "persona|temporal|geographic|tone",
    "query": "The modified query incorporating the context"
  }
]

Make the variants realistic and diverse. Return valid JSON only, no other text.`,
    })

    const parsed = parseAIJsonResponse(text)
    return Array.isArray(parsed) ? parsed : parsed.variants || []
  } catch (error) {
    console.error("[v0] Error generating context variants:", error)
    // Fallback to hardcoded variants
    return [
      {
        context: "Budget-conscious student",
        contextType: "persona",
        query: `${baseQuery} (for a student on a budget)`,
      },
      { context: "Professional researcher", contextType: "persona", query: `${baseQuery} (for professional research)` },
      { context: "As of 2023", contextType: "temporal", query: `${baseQuery} in 2023` },
      { context: "As of 2025", contextType: "temporal", query: `${baseQuery} as of 2025` },
      { context: "In the United States", contextType: "geographic", query: `${baseQuery} in the United States` },
      { context: "In Europe", contextType: "geographic", query: `${baseQuery} in Europe` },
      { context: "Casual tone", contextType: "tone", query: `${baseQuery} (explain casually)` },
      { context: "Technical report", contextType: "tone", query: `${baseQuery} (technical analysis)` },
    ]
  }
}

type SelectedVariants = {
  persona: string[]
  temporal: string[]
  geographic: string[]
  tone: string[]
}

const CONTEXT_OPTIONS = {
  persona: [
    { id: "student", label: "Student on a budget", query: "(for a student on a budget)" },
    { id: "professional", label: "Professional researcher", query: "(for professional research)" },
    { id: "beginner", label: "Complete beginner", query: "(explain for a complete beginner)" },
    { id: "expert", label: "Industry expert", query: "(for an industry expert)" },
    { id: "business", label: "Business decision maker", query: "(for business decision making)" },
  ],
  temporal: [
    { id: "2023", label: "As of 2023", query: "in 2023" },
    { id: "2024", label: "As of 2024", query: "in 2024" },
    { id: "2025", label: "Current (2025)", query: "as of 2025" },
    { id: "future", label: "Future outlook (2026+)", query: "looking ahead to 2026 and beyond" },
  ],
  geographic: [
    { id: "us", label: "United States", query: "in the United States" },
    { id: "europe", label: "Europe", query: "in Europe" },
    { id: "asia", label: "in Asia", query: "in Asia" },
    { id: "global", label: "Global perspective", query: "from a global perspective" },
    { id: "developing", label: "Developing countries", query: "in developing countries" },
  ],
  tone: [
    { id: "casual", label: "Casual conversation", query: "(explain casually)" },
    { id: "professional", label: "Professional report", query: "(professional analysis)" },
    { id: "technical", label: "Technical deep-dive", query: "(technical deep-dive)" },
    { id: "eli5", label: "Explain like I'm 5", query: "(explain like I'm 5)" },
  ],
}

async function getReferencesForQuery(query: string, provider: string, modelId: string): Promise<ModelContextResult> {
  const startTime = Date.now()

  try {
    const { text } = await generateText({
      model: modelId,
      prompt: `You are a search engine that provides ranked references for queries.

For this query: "${query}"

Provide 5-8 high-quality web references you would cite to answer this query.

Return ONLY a JSON array with this exact structure:
[
  {
    "url": "https://example.com/page",
    "title": "Page Title",
    "domain": "example.com",
    "relevanceScore": 95,
    "snippet": "Brief explanation of why this source is relevant",
    "tokensRead": 500,
    "category": "news"
  }
]

Important: 
- Use only these categories: news, blog, academic, official, community, commercial
- Rank them by relevance (most relevant first)
- Use realistic URLs and domains
- Return valid JSON only with no trailing commas
- Do not include any text outside the JSON array`,
    })

    const parsed = parseAIJsonResponse(text)
    const references = Array.isArray(parsed) ? parsed : parsed.references || []

    const responseTime = Date.now() - startTime
    const totalTokens = references.reduce((sum: number, ref: any) => sum + (ref.tokensRead || 0), 0) + 150 // Add prompt tokens
    const tokensReadFromContent = references.reduce((sum: number, ref: any) => sum + (ref.tokensRead || 0), 0)

    return {
      provider,
      references,
      responseTime,
      totalTokens,
      tokensReadFromContent,
    }
  } catch (error) {
    console.error(`[v0] Error getting references for ${provider}:`, error)

    // Return fallback data
    const responseTime = Date.now() - startTime
    return {
      provider,
      references: [
        {
          url: `https://example.com/${provider.toLowerCase().replace(/\s+/g, "-")}`,
          title: `${provider} Reference for: ${query}`,
          domain: "example.com",
          relevanceScore: 85,
          snippet: `Relevant information about ${query}`,
          tokensRead: 500,
          category: "official" as const,
        },
      ],
      responseTime,
      totalTokens: 650,
      tokensReadFromContent: 500,
    }
  }
}

function calculateInsights(
  variants: ContextVariant[],
  results: { [variantIndex: number]: ModelContextResult[] },
): ContextExplorationResult["insights"] {
  // Calculate citation overlap between contexts for each model
  const modelStability: { [provider: string]: number[] } = {}

  Object.entries(results).forEach(([variantIndex, modelResults]) => {
    modelResults.forEach((result) => {
      if (!modelStability[result.provider]) {
        modelStability[result.provider] = []
      }

      // Compare with other variants
      Object.entries(results).forEach(([otherIndex, otherModelResults]) => {
        if (variantIndex !== otherIndex) {
          const otherResult = otherModelResults.find((r) => r.provider === result.provider)
          if (otherResult) {
            const overlap = calculateCitationOverlap(result.references, otherResult.references)
            modelStability[result.provider].push(overlap)
          }
        }
      })
    })
  })

  // Find most stable model (highest average overlap)
  const modelAverages = Object.entries(modelStability).map(([provider, overlaps]) => ({
    provider,
    avgOverlap: overlaps.reduce((sum, val) => sum + val, 0) / overlaps.length,
  }))
  const mostStableModel = modelAverages.sort((a, b) => b.avgOverlap - a.avgOverlap)[0]?.provider || "Unknown"

  // Calculate which context type causes most drift
  const contextDrift: { [contextType: string]: number[] } = {}
  Object.entries(results).forEach(([variantIndex, modelResults]) => {
    const variant = variants[Number.parseInt(variantIndex)]
    if (!contextDrift[variant.contextType]) {
      contextDrift[variant.contextType] = []
    }

    // Compare with base context (first variant of same type)
    const baseVariantIndex = variants.findIndex((v) => v.contextType === variant.contextType)
    if (baseVariantIndex !== Number.parseInt(variantIndex)) {
      const baseResults = results[baseVariantIndex]
      modelResults.forEach((result) => {
        const baseResult = baseResults.find((r) => r.provider === result.provider)
        if (baseResult) {
          const overlap = calculateCitationOverlap(result.references, baseResult.references)
          contextDrift[variant.contextType].push(100 - overlap) // Drift = 100 - overlap
        }
      })
    }
  })

  const contextDriftAverages = Object.entries(contextDrift).map(([contextType, drifts]) => ({
    contextType,
    avgDrift: drifts.reduce((sum, val) => sum + val, 0) / drifts.length,
  }))
  const mostDriftCausingContext =
    contextDriftAverages.sort((a, b) => b.avgDrift - a.avgDrift)[0]?.contextType || "Unknown"

  // Calculate average citation overlap across all comparisons
  const allOverlaps = Object.values(modelStability).flat()
  const averageCitationOverlap = allOverlaps.reduce((sum, val) => sum + val, 0) / allOverlaps.length

  // Calculate top domains
  const domainFrequency: { [domain: string]: number } = {}
  Object.values(results).forEach((modelResults) => {
    modelResults.forEach((result) => {
      result.references.forEach((ref) => {
        domainFrequency[ref.domain] = (domainFrequency[ref.domain] || 0) + 1
      })
    })
  })
  const topDomains = Object.entries(domainFrequency)
    .map(([domain, frequency]) => ({ domain, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10)

  // Context sensitivity score (0-100, higher = more sensitive to context)
  const contextSensitivityScore = 100 - averageCitationOverlap

  return {
    mostStableModel,
    mostDriftCausingContext,
    averageCitationOverlap,
    topDomains,
    contextSensitivityScore,
  }
}

function calculateCitationOverlap(refs1: Reference[], refs2: Reference[]): number {
  const domains1 = new Set(refs1.map((r) => r.domain))
  const domains2 = new Set(refs2.map((r) => r.domain))

  const intersection = new Set([...domains1].filter((d) => domains2.has(d)))
  const union = new Set([...domains1, ...domains2])

  return union.size === 0 ? 0 : (intersection.size / union.size) * 100
}

function generateCustomVariants(baseQuery: string, selectedVariants: SelectedVariants): ContextVariant[] {
  const variants: ContextVariant[] = []

  // Generate persona variants
  selectedVariants.persona.forEach((id) => {
    const option = CONTEXT_OPTIONS.persona.find((o) => o.id === id)
    if (option) {
      variants.push({
        context: option.label,
        contextType: "persona",
        query: `${baseQuery} ${option.query}`,
      })
    }
  })

  // Generate temporal variants
  selectedVariants.temporal.forEach((id) => {
    const option = CONTEXT_OPTIONS.temporal.find((o) => o.id === id)
    if (option) {
      variants.push({
        context: option.label,
        contextType: "temporal",
        query: `${baseQuery} ${option.query}`,
      })
    }
  })

  // Generate geographic variants
  selectedVariants.geographic.forEach((id) => {
    const option = CONTEXT_OPTIONS.geographic.find((o) => o.id === id)
    if (option) {
      variants.push({
        context: option.label,
        contextType: "geographic",
        query: `${baseQuery} ${option.query}`,
      })
    }
  })

  // Generate tone variants
  selectedVariants.tone.forEach((id) => {
    const option = CONTEXT_OPTIONS.tone.find((o) => o.id === id)
    if (option) {
      variants.push({
        context: option.label,
        contextType: "tone",
        query: `${baseQuery} ${option.query}`,
      })
    }
  })

  return variants
}

export async function exploreContextSensitivity(
  baseQuery: string,
  variantMode: "ai" | "custom" = "ai",
  selectedVariants?: SelectedVariants,
): Promise<ContextExplorationResult> {
  // Step 1: Generate context variants based on mode
  let variants: ContextVariant[]

  if (variantMode === "custom" && selectedVariants) {
    variants = generateCustomVariants(baseQuery, selectedVariants)
  } else {
    variants = await generateContextVariants(baseQuery)
  }

  // Step 2: For each variant, get references from all three models
  const results: { [variantIndex: number]: ModelContextResult[] } = {}

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i]

    // Query all three models in parallel
    const [openaiResult, claudeResult, geminiResult] = await Promise.all([
      getReferencesForQuery(variant.query, "OpenAI GPT-4", "openai/gpt-4o"),
      getReferencesForQuery(variant.query, "Claude Sonnet", "anthropic/claude-sonnet-4-5"),
      getReferencesForQuery(variant.query, "Gemini Flash", "google/gemini-2.5-flash"),
    ])

    results[i] = [openaiResult, claudeResult, geminiResult]
  }

  // Step 3: Calculate insights
  const insights = calculateInsights(variants, results)

  return {
    baseQuery,
    variants,
    results,
    insights,
  }
}
