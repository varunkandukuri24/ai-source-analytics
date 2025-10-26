import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SourceAnalysis, Source } from '@/types'

// Initialize AI providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Helper function to extract URLs from text
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.match(urlRegex) || []
}

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

// Helper function to categorize domain credibility
function categorizeCredibility(domain: string): 'high' | 'medium' | 'low' {
  const highCredibility = [
    'wikipedia.org', 'nature.com', 'science.org', 'pubmed.ncbi.nlm.nih.gov',
    'scholar.google.com', 'arxiv.org', 'ieee.org', 'acm.org', 'springer.com',
    'wiley.com', 'elsevier.com', 'oxfordjournals.org', 'cambridge.org',
    'mit.edu', 'stanford.edu', 'harvard.edu', 'berkeley.edu', 'cmu.edu',
    'nasa.gov', 'nih.gov', 'cdc.gov', 'who.int', 'un.org', 'worldbank.org'
  ]
  
  const mediumCredibility = [
    'cnn.com', 'bbc.com', 'reuters.com', 'ap.org', 'bloomberg.com',
    'forbes.com', 'techcrunch.com', 'wired.com', 'theverge.com',
    'medium.com', 'substack.com', 'github.com', 'stackoverflow.com'
  ]
  
  const domainLower = domain.toLowerCase()
  
  if (highCredibility.some(d => domainLower.includes(d))) return 'high'
  if (mediumCredibility.some(d => domainLower.includes(d))) return 'medium'
  return 'low'
}

// Helper function to categorize source type
function categorizeSource(domain: string): string {
  const domainLower = domain.toLowerCase()
  
  if (domainLower.includes('wikipedia')) return 'Encyclopedia'
  if (domainLower.includes('scholar') || domainLower.includes('arxiv') || domainLower.includes('pubmed')) return 'Academic'
  if (domainLower.includes('.edu')) return 'Educational'
  if (domainLower.includes('.gov')) return 'Government'
  if (domainLower.includes('news') || domainLower.includes('cnn') || domainLower.includes('bbc')) return 'News'
  if (domainLower.includes('github') || domainLower.includes('stackoverflow')) return 'Technical'
  if (domainLower.includes('medium') || domainLower.includes('substack')) return 'Blog'
  
  return 'Other'
}


export async function analyzeSourcesWithOpenAI(query: string): Promise<SourceAnalysis> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Answer this question: "${query}" and provide a list of specific websites and URLs that contain relevant information. Include actual URLs like https://example.com in your response.`,
        },
      ],
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || ''
    const urls = extractUrls(content)
    
    const sources: Source[] = urls.map(url => {
      const domain = extractDomain(url)
      return {
        url,
        domain,
        credibility: categorizeCredibility(domain),
        category: categorizeSource(domain),
        snippet: content.substring(Math.max(0, content.indexOf(url) - 100), content.indexOf(url) + 200)
      }
    })

    const uniqueDomains = [...new Set(sources.map(s => s.domain))]
    
    return {
      provider: 'openai',
      sources,
      totalSources: sources.length,
      uniqueDomains,
      domainDiversity: uniqueDomains.length,
      timestamp: Date.now(),
      tokens: completion.usage?.total_tokens,
      model: 'gpt-4',
    }
  } catch (error) {
    console.error('OpenAI error:', error)
    return {
      provider: 'openai',
      sources: [],
      totalSources: 0,
      uniqueDomains: [],
      domainDiversity: 0,
      timestamp: Date.now(),
    }
  }
}

export async function analyzeSourcesWithClaude(query: string): Promise<SourceAnalysis> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Current stable model
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Answer this question: "${query}" and provide a list of specific websites and URLs that contain relevant information. Include actual URLs like https://example.com in your response.`,
        },
      ],
    })

    const content = message.content[0]?.type === 'text' ? message.content[0].text : ''
    const urls = extractUrls(content)
    
    const sources: Source[] = urls.map(url => {
      const domain = extractDomain(url)
      return {
        url,
        domain,
        credibility: categorizeCredibility(domain),
        category: categorizeSource(domain),
        snippet: content.substring(Math.max(0, content.indexOf(url) - 100), content.indexOf(url) + 200)
      }
    })

    const uniqueDomains = [...new Set(sources.map(s => s.domain))]
    
    return {
      provider: 'claude',
      sources,
      totalSources: sources.length,
      uniqueDomains,
      domainDiversity: uniqueDomains.length,
      timestamp: Date.now(),
      tokens: message.usage?.input_tokens && message.usage?.output_tokens 
        ? message.usage.input_tokens + message.usage.output_tokens 
        : undefined,
      model: 'claude-3-5-sonnet-20240620',
    }
  } catch (error) {
    console.error('Claude error:', error)
    return {
      provider: 'claude',
      sources: [],
      totalSources: 0,
      uniqueDomains: [],
      domainDiversity: 0,
      timestamp: Date.now(),
    }
  }
}

export async function analyzeSourcesWithGemini(query: string): Promise<SourceAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const result = await model.generateContent(`Answer this question: "${query}" and provide a list of specific websites and URLs that contain relevant information. Include actual URLs like https://example.com in your response.`)
    const response = await result.response
    const content = response.text()

    const urls = extractUrls(content)
    
    const sources: Source[] = urls.map(url => {
      const domain = extractDomain(url)
      return {
        url,
        domain,
        credibility: categorizeCredibility(domain),
        category: categorizeSource(domain),
        snippet: content.substring(Math.max(0, content.indexOf(url) - 100), content.indexOf(url) + 200)
      }
    })

    const uniqueDomains = [...new Set(sources.map(s => s.domain))]
    
    return {
      provider: 'gemini',
      sources,
      totalSources: sources.length,
      uniqueDomains,
      domainDiversity: uniqueDomains.length,
      timestamp: Date.now(),
      model: 'gemini-2.0-flash-exp',
    }
  } catch (error) {
    console.error('Gemini error:', error)
    return {
      provider: 'gemini',
      sources: [],
      totalSources: 0,
      uniqueDomains: [],
      domainDiversity: 0,
      timestamp: Date.now(),
    }
  }
}

export async function analyzeAllProviders(query: string): Promise<SourceAnalysis[]> {
  const [openaiResult, claudeResult, geminiResult] = await Promise.allSettled([
    analyzeSourcesWithOpenAI(query),
    analyzeSourcesWithClaude(query),
    analyzeSourcesWithGemini(query),
  ])

  return [
    openaiResult.status === 'fulfilled' ? openaiResult.value : {
      provider: 'openai' as const,
      sources: [],
      totalSources: 0,
      uniqueDomains: [],
      domainDiversity: 0,
      timestamp: Date.now(),
    },
    claudeResult.status === 'fulfilled' ? claudeResult.value : {
      provider: 'claude' as const,
      sources: [],
      totalSources: 0,
      uniqueDomains: [],
      domainDiversity: 0,
      timestamp: Date.now(),
    },
    geminiResult.status === 'fulfilled' ? geminiResult.value : {
      provider: 'gemini' as const,
      sources: [],
      totalSources: 0,
      uniqueDomains: [],
      domainDiversity: 0,
      timestamp: Date.now(),
    },
  ]
}
