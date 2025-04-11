"use client"
import Link from 'next/link'
import NumberSlider from "@/components/number-slider"
import { Card, CardContent } from "@/components/ui/card"

export default function SliderPlayPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/games/slider" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Number Slider
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <NumberSlider />
        </CardContent>
      </Card>
    </main>
  )
}
