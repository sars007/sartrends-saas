'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [filters, setFilters] = useState({ location: '', truckType: '', availability: 'all' })

  const fetchDrivers = async () => {
    const params = new URLSearchParams(filters as any)
    const res = await fetch(`/api/drivers?${params}`)
    const data = await res.json()
    setDrivers(data)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Drivers Marketplace</h1>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Location" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="flex-1" />
        <Input placeholder="Truck Type" value={filters.truckType} onChange={(e) => setFilters({...filters, truckType: e.target.value})} />
        <Button onClick={fetchDrivers}>Search</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {drivers.map((driver: any) => (
          <Card key={driver.id}>
            <CardHeader>
              <CardTitle>{driver.user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Location: {driver.location}</p>
              <p>Truck: {driver.truckType}</p>
              <p>Available: {driver.availability ? 'Yes' : 'No'}</p>
              <p>Rating: {driver.rating} ⭐</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

