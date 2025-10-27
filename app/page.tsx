"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Network, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
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
          <Link href="/context-explorer">
            <Button size="sm" className="gap-2">
              <Network className="size-4" />
              Context Explorer
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
            <Sparkles className="size-4" />
            <span>Explore Context Sensitivity Across AI Models</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Discover how <span className="text-primary">context changes</span> AI search results
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Compare search references from OpenAI, Claude, and Gemini. See how different contexts like persona,
            location, and tone affect which sources AI models cite.
          </p>

          <Link href="/context-explorer" className="block max-w-2xl mx-auto">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-chart-3 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex items-center gap-2 bg-card border-2 border-border/50 rounded-full p-2 group-hover:border-primary/50 transition-colors">
                <Search className="size-5 text-muted-foreground ml-4" />
                <div className="flex-1 px-4 py-3 text-base text-muted-foreground/60">
                  Enter a query to explore context sensitivity...
                </div>
                <Button size="lg" className="rounded-full gap-2 group/btn">
                  Explore
                  <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Try: "top travel destinations" or "best programming languages for beginners"
            </p>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Everything you need to understand AI search behavior
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              Built for researchers, developers, and AI enthusiasts exploring how context affects AI citations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Context Sensitivity Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore how different contexts like persona, location, time, and tone affect which sources AI models
                  cite. Measure citation stability and drift across contexts.
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <div className="space-y-4">
                <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Search className="size-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Reference Comparison</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compare search references side-by-side across OpenAI, Claude, and Gemini. See which URLs each model
                  cites with relevance scores and categories.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
