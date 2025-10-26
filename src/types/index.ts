export interface Source {
  url: string
  domain: string
  title?: string
  snippet?: string
  credibility?: 'high' | 'medium' | 'low'
  category?: string
}

export interface SourceAnalysis {
  provider: 'openai' | 'claude' | 'gemini'
  sources: Source[]
  totalSources: number
  uniqueDomains: string[]
  domainDiversity: number
  timestamp: number
  model?: string
  tokens?: number
}

export interface SearchComparison {
  query: string
  analyses: SourceAnalysis[]
  timestamp: number
  overallDiversity: number
  commonSources: string[]
  uniqueSources: {
    openai: string[]
    claude: string[]
    gemini: string[]
  }
}

export interface ProviderConfig {
  name: string
  color: string
  icon: string
}
