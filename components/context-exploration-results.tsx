"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContextExplorationResult } from "@/app/actions/explore-context"
import { TrendingUp, Minus, Clock, Coins, Target, Globe, ExternalLink } from "lucide-react"
import { useState } from "react"

interface ContextExplorationResultsProps {
  results: ContextExplorationResult
  baseQuery: string
}

export function ContextExplorationResults({ results, baseQuery }: ContextExplorationResultsProps) {
  const { variants, results: variantResults, insights } = results
  const [expandedVariant, setExpandedVariant] = useState<number | null>(null)

  // Group variants by context type
  const variantsByType = variants.reduce(
    (acc, variant, index) => {
      if (!acc[variant.contextType]) {
        acc[variant.contextType] = []
      }
      acc[variant.contextType].push({ variant, index })
      return acc
    },
    {} as Record<string, Array<{ variant: (typeof variants)[0]; index: number }>>,
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Base Query</p>
          <h1 className="text-3xl font-bold text-balance">{baseQuery}</h1>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="size-4" />
                <span>Most Stable Model</span>
              </div>
              <p className="text-2xl font-bold text-primary">{insights.mostStableModel}</p>
            </div>
          </Card>

          <Card className="p-4 bg-accent/5 border-accent/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="size-4" />
                <span>Most Drift-Causing Context</span>
              </div>
              <p className="text-2xl font-bold text-accent capitalize">{insights.mostDriftCausingContext}</p>
            </div>
          </Card>

          <Card className="p-4 bg-chart-3/5 border-chart-3/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Minus className="size-4" />
                <span>Avg Citation Overlap</span>
              </div>
              <p className="text-2xl font-bold text-chart-3">{insights.averageCitationOverlap.toFixed(1)}%</p>
            </div>
          </Card>

          <Card className="p-4 bg-chart-4/5 border-chart-4/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="size-4" />
                <span>Context Sensitivity</span>
              </div>
              <p className="text-2xl font-bold text-chart-4">{insights.contextSensitivityScore.toFixed(1)}%</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Top Domains */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Domain Frequency Heatmap</h2>
        <div className="space-y-2">
          {insights.topDomains.map((domain, index) => {
            const maxFrequency = insights.topDomains[0].frequency
            const percentage = (domain.frequency / maxFrequency) * 100

            return (
              <div key={domain.domain} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {index + 1}. {domain.domain}
                  </span>
                  <span className="text-muted-foreground">{domain.frequency} citations</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Context Variants with Detailed References */}
      <Tabs defaultValue="persona" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="temporal">Temporal</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="tone">Tone</TabsTrigger>
        </TabsList>

        {Object.entries(variantsByType).map(([contextType, variantData]) => (
          <TabsContent key={contextType} value={contextType} className="space-y-6">
            {variantData.map(({ variant, index }) => {
              const modelResults = variantResults[index]
              const isExpanded = expandedVariant === index

              return (
                <Card key={index} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {variant.contextType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{variant.context}</span>
                    </div>
                    <p className="font-medium">{variant.query}</p>
                  </div>

                  {/* Model Comparison Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {modelResults.map((result) => (
                      <Card key={result.provider} className="p-4 bg-card/50">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{result.provider}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              <span>{result.responseTime}ms</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Coins className="size-3" />
                              <span>{result.totalTokens.toLocaleString()} tokens consumed</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              {result.references.length} References
                            </p>
                            {result.references.slice(0, 3).map((ref, refIndex) => (
                              <div
                                key={refIndex}
                                className="text-xs space-y-1 pb-2 border-b border-border/50 last:border-0"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-medium line-clamp-1">{ref.title}</span>
                                  <Badge variant="secondary" className="text-[10px] shrink-0">
                                    {ref.relevanceScore}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <span className="line-clamp-1">{ref.domain}</span>
                                  <span>•</span>
                                  <span>{ref.tokensRead} tokens read</span>
                                </div>
                              </div>
                            ))}
                            {result.references.length > 3 && (
                              <p className="text-xs text-muted-foreground">+{result.references.length - 3} more</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <button
                      onClick={() => setExpandedVariant(isExpanded ? null : index)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {isExpanded ? "Hide" : "Show"} Detailed References
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-6">
                        {modelResults.map((result) => (
                          <div key={result.provider} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-lg">{result.provider}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="size-4" />
                                  <span>{result.responseTime}ms</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Coins className="size-4" />
                                  <span>{result.totalTokens.toLocaleString()} consumed</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Coins className="size-4" />
                                  <span>{result.tokensReadFromContent.toLocaleString()} read</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid gap-3">
                              {result.references.map((ref, refIndex) => (
                                <Card key={refIndex} className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-muted-foreground">
                                            #{refIndex + 1}
                                          </span>
                                          <h5 className="font-semibold text-base">{ref.title}</h5>
                                        </div>
                                        <a
                                          href={ref.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-primary hover:underline flex items-center gap-1"
                                        >
                                          {ref.url}
                                          <ExternalLink className="size-3" />
                                        </a>
                                      </div>
                                      <Badge variant="secondary" className="shrink-0">
                                        {ref.relevanceScore}
                                      </Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed">{ref.snippet}</p>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Globe className="size-3" />
                                        <span>{ref.domain}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Coins className="size-3" />
                                        <span>{ref.tokensRead.toLocaleString()} tokens read</span>
                                      </div>
                                      <Badge variant="outline" className="text-[10px] capitalize">
                                        {ref.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Citation Drift Analysis */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Citation Consistency Scorecard</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Measures how consistently each model cites similar sources across different contexts. Higher scores indicate
          more stable and predictable citation behavior.
        </p>

        <div className="space-y-4">
          {["OpenAI GPT-4", "Claude Sonnet", "Gemini Flash"].map((provider) => {
            // Calculate stability score for this provider
            const providerResults = Object.values(variantResults)
              .flat()
              .filter((r) => r.provider === provider)

            let totalOverlap = 0
            let comparisons = 0

            for (let i = 0; i < providerResults.length; i++) {
              for (let j = i + 1; j < providerResults.length; j++) {
                const domains1 = new Set(providerResults[i].references.map((r) => r.domain))
                const domains2 = new Set(providerResults[j].references.map((r) => r.domain))
                const intersection = new Set([...domains1].filter((d) => domains2.has(d)))
                const union = new Set([...domains1, ...domains2])
                const overlap = union.size === 0 ? 0 : (intersection.size / union.size) * 100
                totalOverlap += overlap
                comparisons++
              }
            }

            const stabilityScore = comparisons === 0 ? 0 : totalOverlap / comparisons

            return (
              <div key={provider} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{provider}</span>
                  <span className="text-sm text-muted-foreground">{stabilityScore.toFixed(1)}% stable</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${stabilityScore}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
