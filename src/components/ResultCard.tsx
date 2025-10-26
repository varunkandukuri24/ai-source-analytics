'use client'

import { SearchResult } from '@/types'
import { Brain, Zap, Search, Clock, Hash, CheckCircle, AlertCircle } from 'lucide-react'

interface ResultCardProps {
  result: SearchResult
}

const providerConfig = {
  openai: {
    name: 'OpenAI GPT-4',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    icon: Brain,
    textColor: 'text-green-400',
  },
  claude: {
    name: 'Anthropic Claude',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    icon: Zap,
    textColor: 'text-orange-400',
  },
  gemini: {
    name: 'Google Gemini',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: Search,
    textColor: 'text-blue-400',
  },
}

export default function ResultCard({ result }: ResultCardProps) {
  const config = providerConfig[result.provider]
  const IconComponent = config.icon
  const isError = result.content.startsWith('Error:')

  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm hover:bg-white/5 transition-all duration-300`}>
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white">{config.name}</h3>
            {result.model && (
              <p className="text-sm text-slate-400">{result.model}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isError ? (
              <AlertCircle className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          <div className={`prose prose-invert max-w-none ${isError ? 'text-red-300' : 'text-slate-200'}`}>
            <p className="leading-relaxed whitespace-pre-wrap text-sm">
              {result.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
            {result.tokens && (
              <div className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                <span>{result.tokens.toLocaleString()} tokens</span>
              </div>
            )}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${isError ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {isError ? 'Error' : 'Success'}
          </div>
        </div>
      </div>
    </div>
  )
}
