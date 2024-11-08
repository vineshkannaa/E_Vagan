'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Train, Bus, Car, Truck } from 'lucide-react'

type TransportMode = 'train' | 'bus' | 'car' | 'truck'

const transportIcons = {
  train: Train,
  bus: Bus,
  car: Car,
  truck: Truck,
}

export default function TransportReceipt() {
  const params = useParams() // Use useParams to get route parameters
  const [info, setInfo] = useState<string[]>([])

  // Parse params.info and store it in state
  useEffect(() => {
    if (params && params.info) {
      // Handle both string and string[] cases
      if (typeof params.info === 'string') {
        setInfo([params.info]) // Convert single string to array
      } else {
        setInfo(params.info) // Already an array
      }
    }
  }, [params])

  // Ensure that info has been loaded before rendering
  if (!info || info.length === 0) {
    return <div>Loading...</div>
  }

  const pickup = info[0]
  const dropoff = info[1]
  const distance = parseFloat(info[2]) // Convert distance to number
  const pricePerKm = parseFloat(info[3]) // Convert price per km to number
  const transportMode = info[4] as TransportMode // Cast transport mode to TransportMode type

  const Icon = transportIcons[transportMode]

  const handlePay = () => {
    alert(`Total fare: ₹${distance * pricePerKm}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center border-b border-gray-200">
          <CardTitle className="text-2xl font-bold">Transport Receipt</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* Render the icon dynamically */}
              {/* <Icon size={24} className="text-primary" /> */}
              <span className="font-semibold capitalize">{transportMode}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Distance</div>
              <div className="font-semibold">{distance} km</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Pickup</div>
            <div className="font-semibold">{pickup}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Dropoff</div>
            <div className="font-semibold">{dropoff}</div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <div>Price per km</div>
            <div className="font-semibold">₹{pricePerKm}</div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <div>Total Fare</div>
            <div>₹{distance * pricePerKm}</div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <Button className="w-full" onClick={handlePay}>
            Pay ₹{distance * pricePerKm}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}