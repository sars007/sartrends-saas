 'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapViewerProps {
  pickup: string
  dropoff: string
  onDistanceChange?: (distance: number) => void
}

export function MapViewer({ pickup, dropoff, onDistanceChange }: MapViewerProps) {
  const [position, setPosition] = useState<[number, number]>([34.0522, -118.2437]) // LA default

  const LocationFinder = () => {
    useMapEvents({
      click: (e) => {
        setPosition(e.latlng)
      },
    })
    return null
  }

  useEffect(() => {
    // Stub distance calc, real use OSRM API or approx
    const distance = 500 // km to mi *1.609
    onDistanceChange?.(distance)
  }, [pickup, dropoff])

  return (
    <MapContainer center={position} zoom={5} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          {pickup} <br /> {dropoff} <br /> Distance: ~500mi
        </Popup>
      </Marker>
      <LocationFinder />
    </MapContainer>
  )
}

