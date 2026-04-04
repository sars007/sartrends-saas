'use client';

import { useState } from 'react';
import { Truck, Package, MapPin, Clock, DollarSign, ArrowRight, Check, Star, Phone, Loader2, Filter, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Load {
  id: string;
  origin: string;
  destination: string;
  weight: string;
  rate: string;
  date: string;
  status: 'available' | 'booked' | 'completed';
  company: string;
  description: string;
}

const mockLoads: Load[] = [
  { id: '1', origin: 'Karachi, Sindh', destination: 'Lahore, Punjab', weight: '20,000 kg', rate: 'PKR 180,000', date: 'Today', status: 'available', company: 'Fast Logistics', description: 'General cargo - No hazardous materials' },
  { id: '2', origin: 'Islamabad, Punjab', destination: 'Quetta, Balochistan', weight: '15,000 kg', rate: 'PKR 220,000', date: 'Tomorrow', status: 'available', company: 'Baloch Transport', description: 'Construction materials' },
  { id: '3', origin: 'Lahore, Punjab', destination: 'Karachi, Sindh', weight: '25,000 kg', rate: 'PKR 195,000', date: 'In 2 days', status: 'booked', company: 'Sialkot Express', description: 'Textile products' },
  { id: '4', origin: 'Faisalabad, Punjab', destination: 'Peshawar, Khyber', weight: '18,000 kg', rate: 'PKR 150,000', date: 'Next week', status: 'available', company: 'Peshawar Freight', description: 'Machinery parts' },
];

const statusColors = { available: 'bg-green-100 text-green-700 border-green-200', booked: 'bg-yellow-100 text-yellow-700 border-yellow-200', completed: 'bg-gray-100 text-gray-700 border-gray-200' };

export default function Orders() {
  const [loads] = useState<Load[]>(mockLoads);
  const [filter, setFilter] = useState<'all' | 'available' | 'booked'>('all');
  const [searchOrigin, setSearchOrigin] = useState('');
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filteredLoads = loads.filter(load => {
    if (filter !== 'all' && load.status !== filter) return false;
    if (searchOrigin && !load.origin.toLowerCase().includes(searchOrigin.toLowerCase())) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProof = async () => {
    if (!proofFile || !selectedLoad) return;
    setUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => { setShowProofModal(false); setUploadSuccess(false); setProofFile(null); setProofPreview(null); }, 2000);
  };

  const handleBookLoad = (load: Load) => {
    setSelectedLoad(load);
    setShowProofModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-bold text-gray-900 mb-2">Dispatch Loads</h1><p className="text-gray-600">Find and book available loads for your trucks</p></div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" />Filters</Button>
            <Button className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"><Package className="h-4 w-4" />Post Load</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: 'Available Loads', value: '24', icon: Package, color: 'bg-green-500' }, { label: 'Your Bookings', value: '8', icon: Truck, color: 'bg-blue-500' }, { label: 'This Month', value: '142', icon: ArrowRight, color: 'bg-purple-500' }, { label: 'Total Earned', value: 'PKR 1.2M', icon: DollarSign, color: 'bg-emerald-500' }].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"><div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', stat.color)}><stat.icon className="h-6 w-6 text-white" /></div><div className="text-2xl font-bold text-gray-900">{stat.value}</div><div className="text-sm text-gray-500">{stat.label}</div></div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Input placeholder="Search by origin..." value={searchOrigin} onChange={(e) => setSearchOrigin(e.target.value)} className="max-w-xs" />
          {(['all', 'available', 'booked'] as const).map((f) => (<Button key={f} variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)} className={cn('capitalize', f === 'available' && filter === f && 'bg-green-600', f === 'booked' && filter === f && 'bg-yellow-600')}>{f}</Button>))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoads.map((load) => (
            <div key={load.id} onClick={() => setSelectedLoad(load)} className={cn('bg-white rounded-2xl border-2 p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1', selectedLoad?.id === load.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200')}>
              <div className="flex items-start justify-between mb-4"><div className={cn('px-3 py-1 rounded-full text-xs font-medium border', statusColors[load.status])}>{load.status.charAt(0).toUpperCase() + load.status.slice(1)}</div><div className="text-lg font-bold text-green-600">{load.rate}</div></div>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-2" /><div><p className="text-xs text-gray-500">Origin</p><p className="font-medium text-gray-900">{load.origin}</p></div></div>
                <div className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-green-500 mt-2" /><div><p className="text-xs text-gray-500">Destination</p><p className="font-medium text-gray-900">{load.destination}</p></div></div>
              </div>
              <div className="border-t border-gray-100 pt-4"><div className="flex items-center justify-between text-sm"><span className="text-gray-500">{load.weight}</span><span className="text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" />{load.date}</span></div></div>
              <div className="mt-4 pt-4 border-t border-gray-100"><p className="text-sm font-medium text-gray-900">{load.company}</p><p className="text-xs text-gray-500 mt-1">{load.description}</p></div>
              {load.status === 'available' && <Button onClick={() => handleBookLoad(load)} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Book Now</Button>}
            </div>
          ))}
        </div>

        {filteredLoads.length === 0 && <div className="text-center py-16"><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Truck className="h-10 w-10 text-gray-400" /></div><h3 className="text-lg font-medium text-gray-900 mb-2">No loads found</h3><p className="text-gray-500">Try adjusting your filters</p></div>}

        {/* Proof Upload Modal */}
        {showProofModal && selectedLoad && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Upload Delivery Proof</CardTitle><CardDescription>Upload proof for load #{selectedLoad.id}</CardDescription></div>
                <Button variant="ghost" size="sm" onClick={() => setShowProofModal(false)}><X className="h-5 w-5" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadSuccess ? (
                  <div className="text-center py-8"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-600" /></div><h3 className="text-lg font-semibold text-gray-900 mb-2">Proof Uploaded!</h3><p className="text-gray-600">Your delivery proof has been submitted successfully.</p></div>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2"><p className="text-sm font-medium text-gray-700">Load Details</p><p className="text-sm text-gray-600">{selectedLoad.origin} → {selectedLoad.destination}</p><p className="text-sm text-gray-600">{selectedLoad.weight} • {selectedLoad.rate}</p></div>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      {proofPreview ? (<div className="relative"><img src={proofPreview} alt="Proof preview" className="max-h-48 mx-auto rounded-lg" /><Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => { setProofFile(null); setProofPreview(null) }}><X className="h-4 w-4" /></Button></div>) : (<><Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" /><p className="text-gray-600 mb-2">Drop your proof screenshot here</p><p className="text-sm text-gray-400">PNG, JPG up to 10MB</p></>)}
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <Textarea placeholder="Add notes about the delivery (optional)" rows={3} />
                    <Button onClick={handleUploadProof} disabled={!proofFile || uploading} className="w-full">
                      {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : <><Upload className="mr-2 h-4 w-4" />Submit Proof</>}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
