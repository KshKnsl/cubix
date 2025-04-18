"use client"
import Link from 'next/link'
import RubiksCube3D from "@/components/rubiks-cube-3d"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RubiksPlayPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/games/rubiks" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Rubik's Cube
        </Link>
        <ThemeToggle />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-6">
          <div className="max-w-3xl mx-auto">
            <RubiksCube3D />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
