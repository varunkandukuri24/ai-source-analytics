import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Search Compare - Compare OpenAI, Claude & Gemini",
  description:
    "Compare search results from OpenAI GPT-4, Anthropic Claude, and Google Gemini side-by-side in real-time.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <footer className="border-t border-white/10 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">Side project by Varun Kandukuri</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
