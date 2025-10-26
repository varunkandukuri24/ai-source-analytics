# AI Search Analytics

A Next.js application that compares search results from OpenAI, Claude, and Gemini for the same query. Built with TypeScript, Tailwind CSS, and deployed on Vercel.

## Features

- 🔍 **Multi-Provider Search**: Compare responses from OpenAI GPT-4, Anthropic Claude, and Google Gemini
- 📊 **Side-by-Side Comparison**: View all three responses in a clean, organized layout
- ⚡ **Real-time Search**: Get instant results from all providers simultaneously
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with Tailwind CSS
- 📈 **Analytics**: Track token usage and response times

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Providers**: OpenAI, Anthropic, Google Gemini
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm (recommended) or npm
- API keys for OpenAI, Anthropic, and Google Gemini

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wknd_ai_search
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Then edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign up or log in
3. Click "Get API Key"
4. Create a new API key
5. Copy the key to your `.env.local` file

## Deployment on Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Manual Deployment

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

3. **Add environment variables**
   - Go to your project settings in Vercel
   - Add the same environment variables from your `.env.local`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API endpoint for search
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── SearchForm.tsx            # Search input component
│   └── ResultCard.tsx            # Individual result display
├── lib/
│   └── ai-providers.ts           # AI provider integrations
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Usage

1. **Enter a query**: Type your question in the search box
2. **Click search**: The app will query all three AI providers simultaneously
3. **Compare results**: View responses side-by-side with provider information
4. **View analytics**: See token usage and response times for each provider

## Customization

### Adding New AI Providers

1. Add the provider to `src/types/index.ts`
2. Create a search function in `src/lib/ai-providers.ts`
3. Update the `searchAllProviders` function
4. Add provider configuration in `src/components/ResultCard.tsx`

### Styling

The app uses Tailwind CSS. You can customize:
- Colors in `tailwind.config.ts`
- Global styles in `src/app/globals.css`
- Component styles in individual component files

## Troubleshooting

### Common Issues

1. **API Key Errors**: Make sure all API keys are correctly set in `.env.local`
2. **Rate Limiting**: Some providers have rate limits. Check your usage in their dashboards
3. **Build Errors**: Make sure all dependencies are installed with `pnpm install`

### Getting Help

- Check the console for error messages
- Verify API keys are working in the provider dashboards
- Ensure you have sufficient credits/quota for each service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.