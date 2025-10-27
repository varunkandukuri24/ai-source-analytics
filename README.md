# AI Context Sensitivity Explorer

Discover how different contexts change which sources AI models cite. This tool reveals how personas, locations, time frames, and tones influence the references returned by OpenAI GPT-4, Anthropic Claude, and Google Gemini.

## What It Does

This tool explores context sensitivity in AI search by analyzing how different user contexts affect which websites and sources AI models reference. Enter a query, select context variants (or let AI generate them), and see how each model's citations change across different personas, geographies, time periods, and communication styles.

## Core Features

**Context Sensitivity Analysis**
- Generate or customize context variants across four dimensions: persona, temporal, geographic, and tone
- Measure citation stability and drift across contexts
- Identify which contexts cause the largest changes in source selection
- Compare model consistency and robustness

**Reference Comparison**
- Side-by-side comparison of sources cited by three leading AI providers
- Detailed reference data including URLs, titles, relevance scores, and token counts
- Domain frequency heatmaps showing which sources appear most often
- Citation consistency scorecards ranking model stability

**Analytics & Insights**
- Tokens consumed vs tokens read from sources
- Response times and domain diversity metrics
- Source category breakdowns (news, academic, blog, etc.)
- Context drift maps showing citation overlap between variants

## Why It Matters

Understanding how context affects AI citations is crucial for evaluating trust, consistency, and grounding in AI responses. This tool helps researchers, developers, and AI enthusiasts explore how different user contexts lead models to cite different sources—revealing important insights about AI behavior and reliability.

## Tech Stack

Next.js 16, TypeScript, Tailwind CSS v4, Vercel AI SDK, Lucide React

---

Side project by Varun Kandukuri
