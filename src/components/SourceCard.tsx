'use client'

import { Source } from '@/types'
import { ExternalLink, Shield, AlertTriangle, CheckCircle, Globe, BookOpen, GraduationCap, Building, Newspaper, Code, FileText } from 'lucide-react'

interface SourceCardProps {
  source: Source
}

const credibilityIcons = {
  high: CheckCircle,
  medium: Shield,
  low: AlertTriangle,
}

const categoryIcons = {
  Encyclopedia: BookOpen,
  Academic: GraduationCap,
  Educational: GraduationCap,
  Government: Building,
  News: Newspaper,
  Technical: Code,
  Blog: FileText,
  Other: Globe,
}

const credibilityColors = {
  high: 'text-green-400 bg-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/20',
  low: 'text-red-400 bg-red-500/20',
}

export default function SourceCard({ source }: SourceCardProps) {
  const CredibilityIcon = credibilityIcons[source.credibility || 'low']
  const CategoryIcon = categoryIcons[source.category as keyof typeof categoryIcons] || Globe

  return (
    <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <CategoryIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium truncate flex items-center gap-1"
            >
              {source.domain}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${credibilityColors[source.credibility || 'low']}`}>
              <CredibilityIcon className="w-3 h-3" />
              {source.credibility || 'low'}
            </div>
          </div>
          
          {source.category && (
            <div className="text-xs text-slate-400 mb-2">
              {source.category}
            </div>
          )}
          
          {source.snippet && (
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {source.snippet}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
