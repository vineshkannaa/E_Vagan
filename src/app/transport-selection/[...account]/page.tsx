'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Train, Bus, Car, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type TransportMode = 'train' | 'metro' | 'bus' | 'auto'

export default function TransportSelection() {
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null)
  const router=useRouter()

  const selectMode = (mode: TransportMode) => {
    setSelectedMode(mode)
  }

  const handleProceed = () => {
    if (selectedMode) {
      console.log('Selected mode of transport:', selectedMode)
    }
    router.push(`/route-selection/${selectedMode}`)
  }

  const transportOptions: { mode: TransportMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'train', icon: <Train className="h-12 w-12 sm:h-16 sm:w-16" />, label: 'Train' },
    { mode: 'metro', icon: <Train className="h-12 w-12 sm:h-16 sm:w-16" />, label: 'Metro' },
    { mode: 'bus', icon: <Bus className="h-12 w-12 sm:h-16 sm:w-16" />, label: 'Bus' },
    { mode: 'auto', icon: <Car className="h-12 w-12 sm:h-16 sm:w-16" />, label: 'Auto Rickshaw' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Select Mode of Transport</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {transportOptions.map(({ mode, icon, label }) => (
          <Card 
            key={mode}
            className={`cursor-pointer transition-all ${
              selectedMode === mode ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectMode(mode)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 h-full relative">
              {icon}
              <span className="mt-2 sm:mt-4 text-lg sm:text-xl font-semibold text-center">{label}</span>
              {selectedMode === mode && (
                <CheckCircle2 className="absolute bottom-2 right-2 text-primary h-6 w-6" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleProceed}
          disabled={!selectedMode}
          className="w-full sm:w-auto px-8 py-3 text-lg"
        >
          Proceed
        </Button>
      </div>
    </div>
  )
}