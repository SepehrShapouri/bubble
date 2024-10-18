'use client'
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <WifiOff className="w-16 h-16 mb-4 text-muted-foreground" />
      <h1 className="text-4xl font-bold mb-2">You're offline</h1>
      <p className="text-xl mb-4 text-muted-foreground">Please check your internet connection and try again.</p>
      <Button onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  )
}