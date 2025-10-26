"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Zap, BarChart3, Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { compareAIProviders, type AISearchResponse } from "@/app/actions/compare-ai"
import { ComparisonResults } from "@/components/comparison-results"

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AISearchResponse[] | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    startTransition(async () => {
      const comparisonResults = await compareAIProviders(query)
      setResults(comparisonResults)
    })
  }

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setResults(null)
                setQuery("")
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Search className="size-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">AI Compare</span>
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResults(null)
                setQuery("")
              }}
            >
              New Search
            </Button>
          </div>
        </header>

        <ComparisonResults results={results} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Search className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AI Compare</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#providers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Providers
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </nav>
          <Button size="sm">Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
            <Sparkles className="size-4" />
            <span>Compare AI Models in Real-Time</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            The fastest way to compare <span className="text-primary">AI search results</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Compare responses from OpenAI GPT-4, Anthropic Claude, and Google Gemini side-by-side. Make informed
            decisions with real-time analytics and token tracking.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-chart-3 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex items-center gap-2 bg-card border-2 border-border/50 rounded-full p-2 focus-within:border-primary/50 transition-colors">
                <Search className="size-5 text-muted-foreground ml-4" />
                <Input
                  type="text"
                  placeholder="Ask anything... Compare responses from GPT-4, Claude, and Gemini"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isPending}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full gap-2 group/btn"
                  disabled={!query.trim() || isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    <>
                      Compare
                      <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Try: "Explain quantum computing" or "Write a product description for eco-friendly water bottles"
            </p>
          </form>
        </div>
      </section>

      {/* Providers Section */}
      <section id="providers" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-4">Powered by leading AI providers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <div className="size-6 rounded bg-primary" />
              </div>
              <h3 className="text-xl font-semibold">OpenAI GPT-4</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Industry-leading language model with exceptional reasoning and creative capabilities
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-primary" />
                <span>Text and vision</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-accent/50 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <div className="size-6 rounded bg-accent" />
              </div>
              <h3 className="text-xl font-semibold">Anthropic Claude</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced AI assistant focused on safety, accuracy, and nuanced understanding
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-accent" />
                <span>Long context window</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:border-chart-3/50 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <div className="size-6 rounded bg-chart-3" />
              </div>
              <h3 className="text-xl font-semibold">Google Gemini</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multimodal AI model with powerful search integration and real-time information
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-chart-3" />
                <span>Real-time data</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Everything you need to compare AI models
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              Built for developers, researchers, and AI enthusiasts who want to make data-driven decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Side-by-Side Comparison</h3>
                <p className="text-muted-foreground leading-relaxed">
                  View responses from all three AI providers simultaneously in a clean, organized layout. Easily spot
                  differences in reasoning, style, and accuracy.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4">
                <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="size-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Search</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant results from all providers simultaneously. No waiting, no delays. See how each model
                  responds to your query in real-time.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4">
                <div className="size-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <BarChart3 className="size-6 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold">Analytics & Metrics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track token usage, response times, and cost estimates for each provider. Make informed decisions based
                  on performance data.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4">
                <div className="size-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Sparkles className="size-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">Modern Interface</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beautiful, responsive design that works perfectly on any device. Built with Next.js, TypeScript, and
                  Tailwind CSS.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Simple, powerful workflow</h2>
            <p className="text-muted-foreground text-lg text-balance">Start comparing AI models in three easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-2 border-primary/20">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold">Enter Your Query</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Type your question or prompt into the search bar
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="size-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto border-2 border-accent/20">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-lg font-semibold">Get Instant Results</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All three AI models process your query simultaneously
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="size-16 rounded-full bg-chart-3/10 flex items-center justify-center mx-auto border-2 border-chart-3/20">
                <span className="text-2xl font-bold text-chart-3">3</span>
              </div>
              <h3 className="text-lg font-semibold">Compare & Analyze</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review responses side-by-side with detailed analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-primary/10 via-accent/5 to-chart-3/10 border-primary/20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to compare AI models?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              Start making data-driven decisions about which AI model works best for your use case
            </p>
            <Button size="lg" className="gap-2 group">
              Get Started Now
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-primary flex items-center justify-center">
                <Search className="size-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">AI Compare</span>
            </div>
            <p className="text-sm text-muted-foreground">Built with Next.js, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
