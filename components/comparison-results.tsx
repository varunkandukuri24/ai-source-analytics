"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, AlertCircle, TrendingUp, Globe } from "lucide-react"
import type { AISearchResponse } from "@/app/actions/compare-ai"

interface ComparisonResultsProps {
  results: AISearchResponse[]
}

const providerConfig = {
  openai: {
    name: "OpenAI GPT-4",
    color: "bg-primary",
    borderColor: "border-primary/50",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
  },
  claude: {
    name: "Anthropic Claude",
    color: "bg-accent",
    borderColor: "border-accent/50",
    badgeColor: "bg-accent/10 text-accent border-accent/20",
  },
  gemini: {
    name: "Google Gemini",
    color: "bg-chart-3",
    borderColor: "border-chart-3/50",
    badgeColor: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
}

const categoryColors = {
  news: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  blog: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  academic: "bg-green-500/10 text-green-500 border-green-500/20",
  government: "bg-red-500/10 text-red-500 border-red-500/20",
  commercial: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  social: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function ComparisonResults({ results }: ComparisonResultsProps) {
  const getAnalytics = (result: AISearchResponse) => {
    const categories = result.references.reduce(
      (acc, ref) => {
        acc[ref.category] = (acc[ref.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const avgRelevance =
      result.references.length > 0
        ? result.references.reduce((sum, ref) => sum + ref.relevanceScore, 0) / result.references.length
        : 0

    const uniqueDomains = new Set(result.references.map((ref) => ref.domain)).size

    return { categories, avgRelevance, uniqueDomains }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Search Reference Comparison</h2>
          <p className="text-muted-foreground">
            Comparing the sources and references each AI provider would use for your query
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {results.map((result) => {
            const config = providerConfig[result.provider]
            const analytics = getAnalytics(result)

            return (
              <Card
                key={result.provider}
                className={`p-6 bg-card/50 backdrop-blur border-2 ${config.borderColor} flex flex-col h-full`}
              >
                {/* Header */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-lg ${config.color} flex items-center justify-center`}>
                        <div className="size-5 rounded bg-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{config.name}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  {!result.error && result.references.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="size-3.5" />
                          <span>{(result.responseTime / 1000).toFixed(2)}s</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Globe className="size-3.5" />
                          <span>{analytics.uniqueDomains} domains</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TrendingUp className="size-3.5" />
                          <span>{analytics.avgRelevance.toFixed(0)}% avg</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(analytics.categories).map(([category, count]) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className={`text-xs ${categoryColors[category as keyof typeof categoryColors]}`}
                          >
                            {category}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* References List */}
                <div className="flex-1 space-y-3">
                  {result.error ? (
                    <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <AlertCircle className="size-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-destructive">
                        <p className="font-medium mb-1">Error</p>
                        <p className="text-xs opacity-90">{result.error}</p>
                      </div>
                    </div>
                  ) : result.references.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">No references found</div>
                  ) : (
                    result.references.map((ref, index) => (
                      <div
                        key={index}
                        className="group p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-xs font-mono text-muted-foreground flex-shrink-0">#{index + 1}</span>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium hover:underline truncate flex-1 min-w-0"
                            >
                              {ref.title}
                            </a>
                            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground truncate">{ref.domain}</span>
                          <Badge variant="outline" className={`text-xs ${categoryColors[ref.category]}`}>
                            {ref.category}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ml-auto ${config.badgeColor}`}>
                            {ref.relevanceScore}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ref.snippet}</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
