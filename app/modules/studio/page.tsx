'use client';

import { useState } from 'react';
import { Star, Image, Palette, Type, Layout, Loader2, Download, Copy, RefreshCw, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface GeneratedItem {
  id: string;
  type: 'image' | 'design' | 'text';
  content: string;
  timestamp: Date;
}

const tools = [
  { id: 'image', name: 'Image Generator', description: 'Generate images from text', icon: Image, color: 'from-purple-500 to-pink-500' },
  { id: 'design', name: 'Design Assistant', description: 'Get design suggestions', icon: Palette, color: 'from-orange-500 to-red-500' },
  { id: 'text', name: 'Content Writer', description: 'Write marketing copy', icon: Type, color: 'from-blue-500 to-cyan-500' },
  { id: 'layout', name: 'Layout Ideas', description: 'Get layout suggestions', icon: Layout, color: 'from-green-500 to-emerald-500' },
];

export default function Studio() {
  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedItem[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Simulate generation
    setTimeout(() => {
      const newItem: GeneratedItem = {
        id: Date.now().toString(),
        type: 'text',
        content: `Generated content for: ${prompt}`,
        timestamp: new Date(),
      };
      setResults(prev => [newItem, ...prev]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creative Studio</h1>
          <p className="text-gray-600">AI-powered creative tools for your business</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tools Sidebar */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4">Tools</h2>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selectedTool?.id === tool.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                )}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br', tool.color)}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generator */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', selectedTool.color)}>
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedTool.name}</h2>
                  <p className="text-sm text-gray-500">{selectedTool.description}</p>
                </div>
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe what you want ${selectedTool.name.toLowerCase()} to create...`}
                className="min-h-[120px] border-gray-200 focus:ring-2 focus:ring-blue-500/20 mb-4"
                disabled={loading}
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Generated Results</h2>
                {results.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setResults([])}>
                    Clear All
                  </Button>
                )}
              </div>

              {results.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No results yet</h3>
                  <p className="text-gray-500 text-sm">Enter a prompt and click generate</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Creating something amazing...</h3>
                  <p className="text-gray-500 text-sm">This may take a moment</p>
                </div>
              )}

              <div className="space-y-4">
                {results.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-700 mb-3">{item.content}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
