"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ArrowLeft, Loader2, TrendingUp, FileText, Target, Map } from "lucide-react"
import Link from "next/link"
import { analyzeWebsite, type WebsiteAnalysisResult } from "@/app/actions/analyze-website"
import { WebsiteAnalysisResults } from "@/components/website-analysis-results"

export default function AnalyzePage() {
  const [targetWebsite, setTargetWebsite] = useState("")
  const [focusTopics, setFocusTopics] = useState("")
  const [competitors, setCompetitors] = useState("")
  const [results, setResults] = useState<WebsiteAnalysisResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetWebsite.trim()) return

    startTransition(async () => {
      const analysisResults = await analyzeWebsite({
        targetWebsite: targetWebsite.trim(),
        focusTopics: focusTopics
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        competitors: competitors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      })
      setResults(analysisResults)
    })
  }

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Search className="size-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">AI Compare</span>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResults(null)
                setTargetWebsite("")
                setFocusTopics("")
                setCompetitors("")
              }}
            >
              New Analysis
            </Button>
          </div>
        </header>

        <WebsiteAnalysisResults results={results} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Search className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AI Compare</span>
          </Link>
          <Link href="/">
            <Button size="sm" variant="outline">
              <ArrowLeft className="size-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 mb-6">
              <TrendingUp className="size-4" />
              <span>AI Search Visibility Analytics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Analyze Your Website's <span className="text-primary">AI Visibility</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Discover how your website appears across OpenAI, Claude, and Gemini. Get actionable insights to improve
              your AI search rankings.
            </p>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="website" className="text-base font-semibold">
                  Target Website *
                </Label>
                <Input
                  id="website"
                  type="text"
                  placeholder="example.com"
                  value={targetWebsite}
                  onChange={(e) => setTargetWebsite(e.target.value)}
                  disabled={isPending}
                  className="text-base"
                  required
                />
                <p className="text-sm text-muted-foreground">Enter the domain you want to analyze</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics" className="text-base font-semibold">
                  Focus Topics
                </Label>
                <Input
                  id="topics"
                  type="text"
                  placeholder="e.g., project management, productivity tools, team collaboration"
                  value={focusTopics}
                  onChange={(e) => setFocusTopics(e.target.value)}
                  disabled={isPending}
                  className="text-base"
                />
                <p className="text-sm text-muted-foreground">Comma-separated topics or product categories (optional)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors" className="text-base font-semibold">
                  Competitors
                </Label>
                <Input
                  id="competitors"
                  type="text"
                  placeholder="e.g., competitor1.com, competitor2.com"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  disabled={isPending}
                  className="text-base"
                />
                <p className="text-sm text-muted-foreground">Comma-separated competitor domains (optional)</p>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={!targetWebsite.trim() || isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Analyzing Website...
                  </>
                ) : (
                  <>
                    <TrendingUp className="size-5" />
                    Analyze Website
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="size-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Prompt Panel Generation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Generate 25-50 realistic queries that users might ask to discover your website
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Search className="size-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">AI Citation Extraction</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track citations, sentiment, and competitor mentions across all AI models
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Target className="size-5 text-chart-3" />
                </div>
                <h3 className="text-lg font-semibold">Optimization Guidance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get actionable recommendations to improve your AI search visibility
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Map className="size-5 text-chart-4" />
                </div>
                <h3 className="text-lg font-semibold">Attribution Mapping</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identify which pages drive citations and discover content gaps
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
