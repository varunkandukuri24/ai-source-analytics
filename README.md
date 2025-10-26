# AI Search Reference Comparison

Compare how different AI models (OpenAI GPT-4, Anthropic Claude, and Google Gemini) select and rank web sources for the same search query.

## What It Does

This tool analyzes which websites and sources each AI provider would reference when answering your search query. Instead of comparing text responses, it compares the underlying sources, citations, and references each model considers most relevant.

## Features

- Side-by-side comparison of search references from three leading AI providers
- Ranked lists of sources with relevance scores
- Analytics including response time, token usage, domain diversity, and source categories
- Real-time parallel queries to all three providers
- Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- Vercel AI SDK
- Lucide React icons

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Add your API keys to `.env.local`:
   \`\`\`
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   \`\`\`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)
