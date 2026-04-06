'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, Check, Sparkles, TrendingUp, Megaphone } from 'lucide-react';
import Link from 'next/link';

export default function AIMarketingGenerator() {
  const [prompt, setPrompt] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateMarketing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/ai/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, audience }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate marketing content');
      }

      setResult(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Megaphone className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Marketing Generator</h1>
              <p className="text-xl text-gray-600">Create high-converting marketing copy instantly</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Marketing Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={generateMarketing}>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you need...&#10;&#10;Examples:&#10;'Write Facebook ad for AI resume builder'&#10;'Create email campaign for SEO services'&#10;'LinkedIn post announcing new feature'"
                  className="min-h-[200px] resize-vertical"
                  rows={6}
                />
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Optional: Target audience (e.g. small business owners, marketers)"
                />
                <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600" disabled={loading || !prompt.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Marketing Copy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Marketing Content
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Generated Copy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
              {result ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-1 gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy to Clipboard
                    </Button>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 min-h-[300px] prose max-w-none">
                    <div className="whitespace-pre-wrap">{result}</div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">High-converting marketing copy will appear here</p>
                    <p className="text-sm mt-1">Ready for ads, emails, social media, landing pages</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


