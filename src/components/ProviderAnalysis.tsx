'use client'

import { SourceAnalysis } from '@/types'
import { Brain, Zap, Search, Globe, TrendingUp, ExternalLink } from 'lucide-react'

interface ProviderAnalysisProps {
  analysis: SourceAnalysis
}

const providerConfig = {
  openai: {
    name: 'OpenAI GPT-4',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/5',
    borderColor: 'border-green-500/20',
    icon: Brain,
    textColor: 'text-green-400',
    headerBg: 'bg-green-500/10',
  },
  claude: {
    name: 'Anthropic Claude',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/5',
    borderColor: 'border-orange-500/20',
    icon: Zap,
    textColor: 'text-orange-400',
    headerBg: 'bg-orange-500/10',
  },
  gemini: {
    name: 'Google Gemini',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/5',
    borderColor: 'border-blue-500/20',
    icon: Search,
    textColor: 'text-blue-400',
    headerBg: 'bg-blue-500/10',
  },
}

export default function ProviderAnalysis({ analysis }: ProviderAnalysisProps) {
  const config = providerConfig[analysis.provider]
  const IconComponent = config.icon

  const credibilityCounts = analysis.sources.reduce((acc, source) => {
    const cred = source.credibility || 'low'
    acc[cred] = (acc[cred] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className={`h-full flex flex-col ${config.bgColor} rounded-xl border ${config.borderColor} overflow-hidden`}>
      {/* Header */}
      <div className={`${config.headerBg} px-4 py-3 border-b ${config.borderColor}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">{config.name}</h3>
            <p className="text-xs text-slate-400">{analysis.model}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{analysis.totalSources}</div>
            <div className="text-xs text-slate-400">sources</div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <Globe className="w-3 h-3" />
            <span>{analysis.domainDiversity} domains</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <TrendingUp className="w-3 h-3" />
            <span>{analysis.uniqueDomains.length} unique</span>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto">
        {analysis.sources.length > 0 ? (
          <div className="p-3 space-y-2">
            {analysis.sources.map((source, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${
                        source.credibility === 'high' ? 'bg-green-400' :
                        source.credibility === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium truncate block flex items-center gap-1"
                      >
                        {source.domain}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                      {source.category && (
                        <div className="text-xs text-slate-500 mt-0.5">{source.category}</div>
                      )}
                      {source.snippet && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {source.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-slate-400 mb-2">
                <IconComponent className="w-8 h-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm text-slate-400">No sources found</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {Object.keys(credibilityCounts).length > 0 && (
        <div className="px-3 py-2 bg-white/5 border-t border-white/10">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(credibilityCounts).map(([cred, count]) => (
              <div key={cred} className={`px-2 py-1 rounded text-xs font-medium ${
                cred === 'high' ? 'bg-green-500/20 text-green-400' :
                cred === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {cred}: {count}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}