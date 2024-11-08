'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { useRouter } from 'next/navigation'

interface RouteSummary {
  totalDistance: number;
  totalTime: number;
}

interface Route {
  summary: RouteSummary;
}

interface RoutesFoundEvent {
  routes: Route[];
}

export default function RouteSelection({params}:{params:{mode:string[]}}) {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [map, setMap] = useState<L.Map | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const router=useRouter()

  useEffect(() => {
    if (mapRef.current && !map) {
      const mapInstance = L.map(mapRef.current).setView([0, 0], 2)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance)
      setMap(mapInstance)
    }
  }, [map])

  const searchLocation = async (query: string): Promise<LatLngTuple | null> => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
    const data = await response.json()
    
    // Ensure that the data has both latitude and longitude
    if (data[0] && data[0].lat && data[0].lon) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as LatLngTuple
    }
    
    return null
  }

  const calculateRoute = async () => {
    if (map) {
      const pickupCoords = await searchLocation(pickup)
      const destinationCoords = await searchLocation(destination)

      if (pickupCoords && destinationCoords) {
        // @ts-ignore (Leaflet types are not fully compatible with the routing machine plugin)
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(pickupCoords),
            L.latLng(destinationCoords)
          ],
          routeWhileDragging: true
        }).addTo(map)

        routingControl.on('routesfound', (e: RoutesFoundEvent) => {
          const routes = e.routes;
          const summary = routes[0].summary;
          setDistance(summary.totalDistance / 1000); // Convert to kilometers
        })

        map.fitBounds([pickupCoords, destinationCoords])
      } else {
        alert('Could not find one or both locations. Please try again.')
      }
    }
  }

  const calculatePrice = () => {
    if (distance !== null) {
      const calculatedPrice = Math.round(distance * 15) // 15 rupees per km
      setPrice(calculatedPrice)
      router.push(`/receipt/${pickup}/${destination}/${distance}/15/${params.mode[0]}`)
    } else {
      alert('Please calculate the route first.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Select Route</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Location</Label>
            <Input
              id="pickup"
              placeholder="Enter pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div ref={mapRef} className="w-full h-64 rounded-md overflow-hidden"></div>
          {distance !== null && (
            <div className="text-center">
              <p>Distance: {distance.toFixed(2)} km</p>
            </div>
          )}
          {price !== null && (
            <div className="text-center font-bold text-lg">
              <p>Estimated Price: ₹{price}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={calculateRoute}
            disabled={!pickup || !destination}
            className="w-full sm:w-1/2"
          >
            Calculate Route
          </Button>
          <Button 
            onClick={calculatePrice}
            disabled={distance === null}
            className="w-full sm:w-1/2"
          >
            Calculate Price
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}