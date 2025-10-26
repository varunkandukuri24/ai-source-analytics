"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Target,
  FileText,
  Map,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  Search,
} from "lucide-react"
import type { WebsiteAnalysisResult } from "@/app/actions/analyze-website"

interface WebsiteAnalysisResultsProps {
  results: WebsiteAnalysisResult
}

const providerConfig = {
  openai: {
    name: "OpenAI GPT-4",
    color: "bg-primary",
    textColor: "text-primary",
    borderColor: "border-primary/50",
  },
  claude: {
    name: "Anthropic Claude",
    color: "bg-accent",
    textColor: "text-accent",
    borderColor: "border-accent/50",
  },
  gemini: {
    name: "Google Gemini",
    color: "bg-chart-3",
    textColor: "text-chart-3",
    borderColor: "border-chart-3/50",
  },
}

const priorityColors = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

const sentimentIcons = {
  positive: <TrendingUp className="size-4 text-green-500" />,
  neutral: <Minus className="size-4 text-gray-500" />,
  negative: <TrendingDown className="size-4 text-red-500" />,
}

export function WebsiteAnalysisResults({ results }: WebsiteAnalysisResultsProps) {
  const overallMentionRate =
    results.modelResults.reduce((sum, model) => sum + model.mentionRate, 0) / results.modelResults.length

  const overallAverageRank =
    results.modelResults.reduce((sum, model) => sum + model.averageRank, 0) / results.modelResults.length

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Analysis Complete
            </Badge>
            <span className="text-sm text-muted-foreground">
              <Clock className="size-3 inline mr-1" />
              {(results.analysisTime / 1000).toFixed(1)}s
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{results.targetWebsite}</h1>
          <p className="text-muted-foreground text-lg">AI Search Visibility Analysis</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Mention Rate</span>
                <TrendingUp className="size-4 text-primary" />
              </div>
              <div className="text-3xl font-bold">{overallMentionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Across all AI models</p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Rank</span>
                <Target className="size-4 text-accent" />
              </div>
              <div className="text-3xl font-bold">{overallAverageRank.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">When mentioned (1 is best)</p>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Queries Analyzed</span>
                <Search className="size-4 text-chart-3" />
              </div>
              <div className="text-3xl font-bold">{results.promptPanel.length}</div>
              <p className="text-xs text-muted-foreground">Realistic user queries</p>
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="citations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="citations">
              <Search className="size-4 mr-2" />
              Citations
            </TabsTrigger>
            <TabsTrigger value="prompts">
              <FileText className="size-4 mr-2" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="optimization">
              <Target className="size-4 mr-2" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="attribution">
              <Map className="size-4 mr-2" />
              Attribution
            </TabsTrigger>
          </TabsList>

          {/* Citations Tab */}
          <TabsContent value="citations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {results.modelResults.map((model) => {
                const config = providerConfig[model.provider]
                return (
                  <Card key={model.provider} className={`p-6 bg-card/50 backdrop-blur border-2 ${config.borderColor}`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-lg ${config.color} flex items-center justify-center`}>
                          <div className="size-5 rounded bg-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{config.name}</h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Mention Rate</span>
                          <span className={`text-lg font-bold ${config.textColor}`}>
                            {model.mentionRate.toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Avg Rank</span>
                          <span className="text-lg font-bold">{model.averageRank.toFixed(1)}</span>
                        </div>

                        <div className="pt-3 border-t border-border/50">
                          <div className="text-xs text-muted-foreground mb-2">Sentiment Breakdown</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {sentimentIcons.positive}
                                <span className="text-sm">Positive</span>
                              </div>
                              <span className="text-sm font-semibold">{model.sentimentBreakdown.positive}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {sentimentIcons.neutral}
                                <span className="text-sm">Neutral</span>
                              </div>
                              <span className="text-sm font-semibold">{model.sentimentBreakdown.neutral}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {sentimentIcons.negative}
                                <span className="text-sm">Negative</span>
                              </div>
                              <span className="text-sm font-semibold">{model.sentimentBreakdown.negative}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/50 space-y-2 max-h-64 overflow-y-auto">
                        <div className="text-xs text-muted-foreground mb-2">Sample Citations</div>
                        {model.citations.slice(0, 5).map((citation, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-muted/50 border border-border/50 text-xs space-y-1"
                          >
                            <div className="font-medium truncate">{citation.query}</div>
                            <div className="flex items-center gap-2">
                              {citation.mentioned ? (
                                <>
                                  <CheckCircle2 className="size-3 text-green-500" />
                                  <span className="text-muted-foreground">Rank {citation.rank}</span>
                                  {sentimentIcons[citation.sentiment]}
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="size-3 text-red-500" />
                                  <span className="text-muted-foreground">Not mentioned</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-4">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold mb-4">
                Generated Query Panel ({results.promptPanel.length} queries)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {results.promptPanel.map((prompt, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-medium flex-1">{prompt.query}</span>
                      <Badge variant="outline" className="text-xs">
                        {prompt.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {prompt.intent}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  Content Recommendations
                </h3>
                <div className="space-y-3">
                  {results.optimization.content.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant="outline" className={priorityColors[rec.priority]}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowUp className="size-3 text-green-500" />
                        <span>Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="size-5 text-accent" />
                  Technical Recommendations
                </h3>
                <div className="space-y-3">
                  {results.optimization.technical.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant="outline" className={priorityColors[rec.priority]}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowUp className="size-3 text-green-500" />
                        <span>Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="size-5 text-chart-3" />
                  Offsite Recommendations
                </h3>
                <div className="space-y-3">
                  {results.optimization.offsite.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant="outline" className={priorityColors[rec.priority]}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowUp className="size-3 text-green-500" />
                        <span>Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Attribution Tab */}
          <TabsContent value="attribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" />
                  Top Performing Pages
                </h3>
                <div className="space-y-3">
                  {results.attribution.topPages.map((page, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-medium truncate flex-1">{page.url}</span>
                        <Badge
                          variant="outline"
                          className={
                            page.strength === "strong"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : page.strength === "moderate"
                                ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {page.strength}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">{page.citationCount} citations</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {page.topics.map((topic, topicIdx) => (
                          <Badge key={topicIdx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="size-5 text-accent" />
                  Content Gaps
                </h3>
                <div className="space-y-3">
                  {results.attribution.contentGaps.map((gap, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{gap.topic}</h4>
                        <Badge variant="outline" className={priorityColors[gap.priority]}>
                          {gap.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{gap.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <ArrowUp className="size-3 text-green-500" />
                        <span className="text-muted-foreground">{gap.opportunity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
