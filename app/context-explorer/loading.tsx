import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="size-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Loading Context Explorer...</p>
      </div>
    </div>
  )
}
