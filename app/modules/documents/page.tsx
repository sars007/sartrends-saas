'use client';

import { useState } from 'react';
import { FileText, Download, Loader2, Check, AlertCircle, Shield, Building2, Truck, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  credits: number;
}

const documentTypes: DocumentType[] = [
  { 
    id: 'truck', 
    name: 'Trucking HSE', 
    description: 'Health & Safety document for trucking operations',
    icon: Truck,
    color: 'bg-orange-500',
    credits: 5
  },
  { 
    id: 'office', 
    name: 'Office HSE', 
    description: 'Health & Safety document for office environments',
    icon: Building2,
    color: 'bg-blue-500',
    credits: 5
  },
  { 
    id: 'construction', 
    name: 'Construction HSE', 
    description: 'Health & Safety document for construction sites',
    icon: Shield,
    color: 'bg-red-500',
    credits: 5
  },
  { 
    id: 'business', 
    name: 'Business Letter', 
    description: 'Professional business correspondence',
    icon: Briefcase,
    color: 'bg-purple-500',
    credits: 3
  },
  { 
    id: 'employment', 
    name: 'Employment Contract', 
    description: 'Standard employment agreement template',
    icon: Users,
    color: 'bg-emerald-500',
    credits: 5
  },
];

export default function Documents() {
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedType || !details.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hse',
          details: { docType: selectedType.id, content: details },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate document');
      }

      const data = await response.json();
      setResult(data.content);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType?.id || 'document'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Generate professional HSE and business documents with AI</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Document Type Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Select Document Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      setResult(null);
                      setError(null);
                    }}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all duration-200',
                      selectedType?.id === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', type.color)}>
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{type.credits} credits</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Details Input */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Document Details</h2>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide details for the document...&#10;&#10;For HSE: company name, number of employees, specific hazards, required certifications&#10;&#10;For Business: purpose, parties involved, key terms"
                className="min-h-[200px] border-gray-200 focus:ring-2 focus:ring-blue-500/20"
                disabled={loading}
              />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedType || !details.trim() || loading}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generate Document ({selectedType?.credits || 0} credits)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Generated Document
              </h2>
              {result && (
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!selectedType && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document Type</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Choose a document type from the options on the left to get started
                </p>
              </div>
            )}

            {selectedType && !result && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <selectedType.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Provide details and click generate to create your {selectedType.name}
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Document</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  AI is creating your document. This may take a moment...
                </p>
              </div>
            )}

            {result && (
              <div className="flex-1 overflow-auto">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {result}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

