'use client'

import { useState } from 'react'
import { Search, Loader2, Sparkles } from 'lucide-react'

interface SearchFormProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-2 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything... Analyze AI source references"
                className="w-full px-6 py-4 pr-16 text-lg bg-transparent text-white placeholder-slate-400 focus:outline-none"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          Try: "What are the latest developments in AI?" or "How does climate change affect agriculture?"
        </p>
      </div>
    </form>
  )
}
