'use client'

import { useState } from 'react'
import SearchForm from '@/components/SearchForm'
import ProviderAnalysis from '@/components/ProviderAnalysis'
import { SearchComparison } from '@/types'
import { Sparkles, Brain, Zap, Search, BarChart3, Clock, TrendingUp, Globe, Target, Users } from 'lucide-react'

export default function Home() {
  const [searchHistory, setSearchHistory] = useState<SearchComparison[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setCurrentQuery(query)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchHistory(prev => [data, ...prev])
    } catch (error) {
      console.error('Search error:', error)
      // Add error results to history
      const errorAnalyses = [
        {
          provider: 'openai' as const,
          sources: [],
          totalSources: 0,
          uniqueDomains: [],
          domainDiversity: 0,
          timestamp: Date.now(),
        },
        {
          provider: 'claude' as const,
          sources: [],
          totalSources: 0,
          uniqueDomains: [],
          domainDiversity: 0,
          timestamp: Date.now(),
        },
        {
          provider: 'gemini' as const,
          sources: [],
          totalSources: 0,
          uniqueDomains: [],
          domainDiversity: 0,
          timestamp: Date.now(),
        },
      ]
      setSearchHistory(prev => [{
        query,
        analyses: errorAnalyses,
        timestamp: Date.now(),
        overallDiversity: 0,
        commonSources: [],
        uniqueSources: { openai: [], claude: [], gemini: [] },
      }, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Source Analytics
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Analyze which websites and sources each AI model references for any query. 
              Compare source diversity, credibility, and discover where AI gets its information.
            </p>
            
            <div className="flex justify-center items-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-slate-300">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="font-medium">OpenAI GPT-4</span>
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-5 h-5 text-orange-400" />
                <span className="font-medium">Anthropic Claude</span>
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
              <div className="flex items-center gap-2 text-slate-300">
                <Search className="w-5 h-5 text-green-400" />
                <span className="font-medium">Google Gemini</span>
              </div>
            </div>
            
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-700 rounded-full animate-spin border-t-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
              </div>
              <div className="text-slate-300 text-lg font-medium">
                Analyzing source references from all AI providers...
              </div>
              <div className="text-slate-500 text-sm">
                Extracting and categorizing website sources
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {searchHistory.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="space-y-8">
            {searchHistory.map((search, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                  {/* Query Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          "{search.query}"
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(search.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Overall Stats */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{search.overallDiversity}</div>
                      <div className="text-sm text-slate-400">Unique Domains</div>
                    </div>
                  </div>

                  {/* Three Column Layout */}
                  <div className="grid gap-4 lg:grid-cols-3 h-96">
                    {search.analyses.map((analysis, analysisIndex) => (
                      <ProviderAnalysis key={analysisIndex} analysis={analysis} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchHistory.length === 0 && !isLoading && (
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-8 rounded-2xl border border-white/10">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-slate-400">OpenAI</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-slate-400">Claude</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-slate-400">Gemini</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Analyze AI Sources
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Enter any question above to see which websites and sources each AI model references. 
                  Compare source diversity, credibility, and discover where AI gets its information.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Source Diversity</h4>
                <p className="text-slate-400 text-sm">Compare unique domains and source variety</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Credibility Analysis</h4>
                <p className="text-slate-400 text-sm">Analyze source credibility and authority</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Source Overlap</h4>
                <p className="text-slate-400 text-sm">Find common and unique sources across AIs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}