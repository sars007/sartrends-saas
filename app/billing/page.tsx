'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, CreditCard, Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Billing() {
  const [copied, setCopied] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const bankDetails = {
    bank: 'Meezan Bank',
    accountNumber: '77010105779192',
    iban: 'PK59MEZN0077010105779192',
    title: 'Ali Raza'
  };

  const copyIBAN = () => {
    navigator.clipboard.writeText(bankDetails.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload
      console.log('Payment screenshot uploaded:', file.name);
      setUploaded(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
              <p className="text-xl text-gray-600">Upgrade your plan via bank transfer</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-6 w-6" />
              Bank Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Bank</label>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {bankDetails.bank}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Account Title</label>
                <p className="font-semibold text-gray-900 text-lg">{bankDetails.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Account Number</label>
                <p className="font-mono text-gray-900 font-semibold">{bankDetails.accountNumber}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">IBAN</label>
                <div className="flex items-center gap-2">
                  <code className="font-mono bg-gray-100 px-4 py-3 rounded-xl text-lg flex-1 text-gray-900">
                    {bankDetails.iban}
                  </code>
                  <Button onClick={copyIBAN} size="sm" variant="outline" className="shrink-0">
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Payment Instructions
              </h3>
              <ul className="space-y-2 text-sm text-orange-900">
                <li>• Transfer to the IBAN above</li>
                <li>• Reference your email in transfer note</li>
                <li>• Upload screenshot below</li>
                <li>• Plan activates within 2 hours after verification</li>
                <li>• Contact support if not activated</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Upload Payment Proof
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploaded && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Screenshot received! Will be verified shortly.
                </Badge>
              )}
              <p className="text-sm text-gray-500">
                Upload screenshot of your bank transfer. We verify payments manually (usually within 1 hour).
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-8 rounded-3xl shadow-2xl">
            <CreditCard className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">Ready for Stripe?</h3>
            <p className="text-lg mb-8 max-w-md mx-auto opacity-90">
              Bank transfer works perfectly, but Stripe integration coming soon for instant payments.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-white/80 text-lg px-8 py-6">
              Notify Me When Ready
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

