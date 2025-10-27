"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2, ArrowLeft, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { exploreContextSensitivity, type ContextExplorationResult } from "@/app/actions/explore-context"
import { ContextExplorationResults } from "@/components/context-exploration-results"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CONTEXT_OPTIONS = {
  persona: [
    { id: "student", label: "🎓 Student on a budget", query: "(for a student on a budget)" },
    { id: "professional", label: "💼 Professional researcher", query: "(for professional research)" },
    { id: "beginner", label: "🌱 Complete beginner", query: "(explain for a complete beginner)" },
    { id: "expert", label: "🎯 Industry expert", query: "(for an industry expert)" },
    { id: "business", label: "📊 Business decision maker", query: "(for business decision making)" },
  ],
  temporal: [
    { id: "2023", label: "📅 As of 2023", query: "in 2023" },
    { id: "2024", label: "📅 As of 2024", query: "in 2024" },
    { id: "2025", label: "✨ Current (2025)", query: "as of 2025" },
    { id: "future", label: "🔮 Future outlook (2026+)", query: "looking ahead to 2026 and beyond" },
  ],
  geographic: [
    { id: "us", label: "🇺🇸 United States", query: "in the United States" },
    { id: "europe", label: "🇪🇺 Europe", query: "in Europe" },
    { id: "asia", label: "🌏 Asia", query: "in Asia" },
    { id: "global", label: "🌍 Global perspective", query: "from a global perspective" },
    { id: "developing", label: "🌱 Developing countries", query: "in developing countries" },
  ],
  tone: [
    { id: "casual", label: "💬 Casual conversation", query: "(explain casually)" },
    { id: "professional", label: "👔 Professional report", query: "(professional analysis)" },
    { id: "technical", label: "🔧 Technical deep-dive", query: "(technical deep-dive)" },
    { id: "eli5", label: "🧒 Explain like I'm 5", query: "(explain like I'm 5)" },
  ],
}

export default function ContextExplorerPage() {
  const [baseQuery, setBaseQuery] = useState("")
  const [results, setResults] = useState<ContextExplorationResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("")

  const [variantMode, setVariantMode] = useState<"ai" | "custom">("ai")
  const [selectedVariants, setSelectedVariants] = useState<{
    persona: string[]
    temporal: string[]
    geographic: string[]
    tone: string[]
  }>({
    persona: [],
    temporal: [],
    geographic: [],
    tone: [],
  })

  const handleExplore = (e: React.FormEvent) => {
    e.preventDefault()
    if (!baseQuery.trim()) return

    if (variantMode === "custom") {
      const totalSelected = Object.values(selectedVariants).reduce((sum, arr) => sum + arr.length, 0)
      if (totalSelected === 0) {
        alert("Please select at least one context variant")
        return
      }
    }

    startTransition(async () => {
      setLoadingProgress(0)
      setLoadingMessage("Preparing context variants...")

      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev < 20) {
            setLoadingMessage("Generating context variants...")
            return prev + 2
          } else if (prev < 50) {
            setLoadingMessage("Querying OpenAI, Claude, and Gemini...")
            return prev + 1.5
          } else if (prev < 80) {
            setLoadingMessage("Extracting citations and references...")
            return prev + 1
          } else if (prev < 95) {
            setLoadingMessage("Analyzing context sensitivity...")
            return prev + 0.5
          }
          return prev
        })
      }, 200)

      const explorationResults = await exploreContextSensitivity(baseQuery, variantMode, selectedVariants)

      clearInterval(progressInterval)
      setLoadingProgress(100)
      setLoadingMessage("Complete!")

      setResults(explorationResults)
    })
  }

  const handleVariantToggle = (category: keyof typeof selectedVariants, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [category]: prev[category].includes(variantId)
        ? prev[category].filter((id) => id !== variantId)
        : [...prev[category], variantId],
    }))
  }

  const getAllSelectedVariants = () => {
    const selected: Array<{ id: string; label: string; category: string }> = []

    Object.entries(selectedVariants).forEach(([category, ids]) => {
      ids.forEach((id) => {
        const option = CONTEXT_OPTIONS[category as keyof typeof CONTEXT_OPTIONS].find((opt) => opt.id === id)
        if (option) {
          selected.push({
            id,
            label: option.label,
            category,
          })
        }
      })
    })

    return selected
  }

  const handleRemoveVariant = (category: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof selectedVariants].filter((id) => id !== variantId),
    }))
  }

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setResults(null)
                setBaseQuery("")
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Context Explorer</span>
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResults(null)
                setBaseQuery("")
              }}
            >
              New Exploration
            </Button>
          </div>
        </header>

        <ContextExplorationResults results={results} baseQuery={baseQuery} />
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md px-4">
          <div className="flex justify-center">
            <div className="text-8xl animate-bounce">🔍</div>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-medium text-foreground">{loadingMessage}</p>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{Math.round(loadingProgress)}% complete</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold text-lg">Context Explorer</span>
          </Link>
          <Link href="/">
            <Button size="sm" variant="outline">
              <ArrowLeft className="size-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
              <Sparkles className="size-4" />
              <span>Context Sensitivity Analysis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Explore how context changes <span className="text-primary">AI citations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Discover how different user contexts (personas, locations, time frames, tones) influence which sources AI
              models cite. Measure citation stability and consistency across models.
            </p>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <form onSubmit={handleExplore} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="baseQuery" className="text-base font-semibold">
                  Base Query
                </Label>
                <p className="text-sm text-muted-foreground">Enter a query to explore across different contexts</p>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-chart-3 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative flex items-center gap-2 bg-card border-2 border-border/50 rounded-full p-2 group-hover:border-primary/50 transition-colors">
                    <Search className="size-5 text-muted-foreground ml-4" />
                    <Input
                      id="baseQuery"
                      type="text"
                      placeholder="Enter a query to explore context sensitivity..."
                      value={baseQuery}
                      onChange={(e) => setBaseQuery(e.target.value)}
                      disabled={isPending}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Try: "top travel destinations" or "best programming languages for beginners"
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Context Variants</Label>
                <RadioGroup value={variantMode} onValueChange={(value) => setVariantMode(value as "ai" | "custom")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ai" id="ai" />
                    <Label htmlFor="ai" className="font-normal cursor-pointer">
                      AI Generated (8 variants automatically created)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-normal cursor-pointer">
                      Custom Selection (choose specific variants)
                    </Label>
                  </div>
                </RadioGroup>

                {variantMode === "custom" && (
                  <div className="pt-4 space-y-6">
                    <Tabs defaultValue="persona" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="persona">Persona</TabsTrigger>
                        <TabsTrigger value="temporal">Time</TabsTrigger>
                        <TabsTrigger value="geographic">Location</TabsTrigger>
                        <TabsTrigger value="tone">Tone</TabsTrigger>
                      </TabsList>

                      <TabsContent value="persona" className="mt-6 space-y-4">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold">Choose persona contexts</h3>
                          <p className="text-sm text-muted-foreground">
                            Select between 1 and {CONTEXT_OPTIONS.persona.length} personas
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {CONTEXT_OPTIONS.persona.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleVariantToggle("persona", option.id)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedVariants.persona.includes(option.id)
                                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="temporal" className="mt-6 space-y-4">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold">Choose time contexts</h3>
                          <p className="text-sm text-muted-foreground">
                            Select between 1 and {CONTEXT_OPTIONS.temporal.length} time periods
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {CONTEXT_OPTIONS.temporal.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleVariantToggle("temporal", option.id)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedVariants.temporal.includes(option.id)
                                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="geographic" className="mt-6 space-y-4">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold">Choose location contexts</h3>
                          <p className="text-sm text-muted-foreground">
                            Select between 1 and {CONTEXT_OPTIONS.geographic.length} locations
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {CONTEXT_OPTIONS.geographic.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleVariantToggle("geographic", option.id)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedVariants.geographic.includes(option.id)
                                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="tone" className="mt-6 space-y-4">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold">Choose tone contexts</h3>
                          <p className="text-sm text-muted-foreground">
                            Select between 1 and {CONTEXT_OPTIONS.tone.length} tones
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {CONTEXT_OPTIONS.tone.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleVariantToggle("tone", option.id)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedVariants.tone.includes(option.id)
                                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>

                    {getAllSelectedVariants().length > 0 && (
                      <div className="border-t border-border/50 pt-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">
                            Selected Variants ({getAllSelectedVariants().length})
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedVariants({
                                persona: [],
                                temporal: [],
                                geographic: [],
                                tone: [],
                              })
                            }
                            className="text-xs h-7"
                          >
                            Clear all
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getAllSelectedVariants().map((variant) => (
                            <button
                              key={`${variant.category}-${variant.id}`}
                              type="button"
                              onClick={() => handleRemoveVariant(variant.category, variant.id)}
                              className="group px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                              <span>{variant.label}</span>
                              <X className="size-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">What happens next:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {variantMode === "ai" ? (
                    <>
                      <li>AI generates 8 contextual variants (persona, location, time, tone)</li>
                      <li>Each variant is tested across OpenAI, Claude, and Gemini</li>
                    </>
                  ) : (
                    <>
                      <li>Your selected variants are tested across OpenAI, Claude, and Gemini</li>
                      <li>Each model provides ranked references for each context</li>
                    </>
                  )}
                  <li>Citations are extracted and analyzed for overlap and drift</li>
                  <li>Results show citation stability scores and context sensitivity insights</li>
                </ul>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={!baseQuery.trim() || isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Exploring Context Sensitivity...
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    Explore Context Sensitivity
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
