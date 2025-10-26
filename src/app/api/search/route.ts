import { NextRequest, NextResponse } from 'next/server'
import { analyzeAllProviders } from '@/lib/ai-providers'
import { SearchComparison } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const analyses = await analyzeAllProviders(query)
    
    // Calculate overall diversity and common/unique sources
    const allDomains = analyses.flatMap(a => a.uniqueDomains)
    const uniqueDomains = Array.from(new Set(allDomains))
    const overallDiversity = uniqueDomains.length
    
    // Find common sources (domains that appear in multiple providers)
    const domainCounts = allDomains.reduce((acc, domain) => {
      acc[domain] = (acc[domain] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const commonSources = Object.entries(domainCounts)
      .filter(([_, count]) => count > 1)
      .map(([domain, _]) => domain)
    
    // Find unique sources for each provider
    const uniqueSources = {
      openai: analyses[0].uniqueDomains.filter(domain => 
        !analyses[1].uniqueDomains.includes(domain) && 
        !analyses[2].uniqueDomains.includes(domain)
      ),
      claude: analyses[1].uniqueDomains.filter(domain => 
        !analyses[0].uniqueDomains.includes(domain) && 
        !analyses[2].uniqueDomains.includes(domain)
      ),
      gemini: analyses[2].uniqueDomains.filter(domain => 
        !analyses[0].uniqueDomains.includes(domain) && 
        !analyses[1].uniqueDomains.includes(domain)
      ),
    }
    
    const comparison: SearchComparison = {
      query,
      analyses,
      timestamp: Date.now(),
      overallDiversity,
      commonSources,
      uniqueSources,
    }
    
    return NextResponse.json(comparison)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
