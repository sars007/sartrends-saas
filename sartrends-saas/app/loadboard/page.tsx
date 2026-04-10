'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loadboard() {
  const [loads, setLoads] = useState([])
  const [filters, setFilters] = useState({ location: '', rate: '', distance: '', trailer: '' })
  const [postForm, setPostForm] = useState({ pickup: '', dropoff: '', ratePerMile: '', weight: '', trailer: 'dryVan', date: '' })
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09])

  useEffect(() => {
    fetchLoads()
  }, [])

  const fetchLoads = async () => {
    const res = await fetch('/api/loads')
    const data = await res.json()
    setLoads(data)
  }

  const handlePostLoad = async (e: React.FormEvent) => {
    e.preventDefault()
    // Calc distance stub
    const distance = 500 // from map
    const totalRate = parseFloat(postForm.ratePerMile) * distance
    const res = await fetch('/api/loads', { method: 'POST', body: JSON.stringify({ ...postForm, distance, totalRate }) })
    if (res.ok) fetchLoads()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Loadboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Load (Broker/Dispatcher)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePostLoad} className="space-y-4">
              <Input placeholder="Pickup Location" onChange={(e) => setPostForm({...postForm, pickup: e.target.value})} />
              <Input placeholder="Dropoff Location" onChange={(e) => setPostForm({...postForm, dropoff: e.target.value})} />
              <Input type="number" placeholder="Rate per Mile" onChange={(e) => setPostForm({...postForm, ratePerMile: e.target.value})} />
              <Input type="number" placeholder="Weight (lbs)" onChange={(e) => setPostForm({...postForm, weight: e.target.value})} />
              <Select onValueChange={(v) => setPostForm({...postForm, trailer: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Trailer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dryVan">Dry Van</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                  <SelectItem value="reefer">Reefer</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Post Load</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Input placeholder="Location" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="flex-1 min-w-[200px]" />
            <Input type="number" placeholder="Min Rate" value={filters.rate} onChange={(e) => setFilters({...filters, rate: e.target.value})} className="w-24" />
            <Input type="number" placeholder="Max Distance" value={filters.distance} onChange={(e) => setFilters({...filters, distance: e.target.value})} className="w-24" />
            <Button onClick={fetchLoads} variant="outline">Filter</Button>
          </div>
          <div className="space-y-4">
            {loads.map((load: any) => (
              <Card key={load.id}>
                <CardContent className="p-4">
                  <h3>{load.pickupLocation} → {load.dropoffLocation}</h3>
                  <p>Rate: ${load.totalRate} ({load.ratePerMile}/mi, {load.distance}mi)</p>
                  <p>Weight: {load.weight}lbs, Trailer: {load.trailerType}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 h-96">
        <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {loads.map((load: any) => (
            <Marker key={load.id} position={position}>
              <Popup>{load.pickupLocation}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

