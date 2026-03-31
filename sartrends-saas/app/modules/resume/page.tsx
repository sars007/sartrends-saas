"use client";

import Link from 'next/link'
import { useState } from 'react'

export default function ResumeBuilder() {
  const [category, setCategory] = useState('professional');
  const [lang, setLang] = useState<'english' | 'urdu'>('english');
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'professional', name: 'Professional Resume', desc: 'Corporate/executive roles', promptTemplate: 'Generate a professional resume for a Senior Software Engineer with 8+ years experience. Include sections: Summary, Skills (React, Next.js, Node.js, AI/ML), Experience (3 roles), Education, Certifications. Use ATS-friendly format with quantifiable achievements.' },
    { id: 'ats', name: 'ATS-Optimized', desc: 'Keyword-optimized for screening', promptTemplate: 'Create an ATS-optimized resume for Software Developer position. Target keywords: React, TypeScript, Next.js, Prisma, TailwindCSS, Stripe integration. Include Summary, Technical Skills, Professional Experience (4 roles with metrics), Projects, Education. Standard headings only.' },
    { id: 'entry', name: 'Entry-Level', desc: 'Junior/new grad resumes', promptTemplate: 'Write an entry-level resume for a Junior Frontend Developer (recent bootcamp grad). Highlight: React projects, freelance work, bootcamp certification, transferable skills from retail/customer service. Sections: Objective, Education, Projects, Skills, Experience.' },
    { id: 'tech', name: 'Tech Startup', desc: 'Modern startup roles', promptTemplate: 'Generate a tech startup resume for Full Stack Developer. Emphasize: Rapid prototyping, AI tools (Ollama), modern stack (Next.js 14+, Tailwind v4, Lucia auth), side projects, GitHub contributions. Creative format with metrics and impact.' },
    { id: 'custom', name: 'Custom Resume', desc: 'Your specific needs', promptTemplate: '' },
  ];

  const generateResume = async () => {
    if (!prompt && !categories.find(c => c.id === category)?.promptTemplate) return;

    setIsLoading(true);
    try {
      const fullPrompt = categories.find(c => c.id === category)?.promptTemplate || prompt;
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, lang }),
      });
      const data = await response.json();
      if (!response.ok) {
        setContent(data.error || 'Error generating resume.');
        return;
      }
      setContent(data.response);
      setCredits(data.credits);
    } catch (error) {
      setContent('Error: Ensure OLLAMA running and you have credits.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResume = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${category}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            AI Resume Builder
          </h1>
          <p className="text-xl text-gray-600">
            Perfect resumes instantly. ATS-optimized, professional, startup-ready.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setLang('english')}
              className={`px-4 py-2 rounded-lg font-medium ${lang === 'english' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
            <button
              onClick={() => setLang('urdu')}
              className={`px-4 py-2 rounded-lg font-medium ${lang === 'urdu' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              اردو
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Credits remaining: <span className="font-bold">{credits}</span></p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Categories */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">Choose Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-6 border-2 rounded-2xl transition-all group ${
                    category === cat.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <div className={`font-semibold text-lg mb-2 ${category === cat.id ? 'text-emerald-600' : 'group-hover:text-emerald-600'}`}>
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-600">{cat.desc}</div>
                </button>
              ))}
            </div>
            {category === 'custom' && (
              <div className="mt-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your custom prompt..."
                  className="w-full p-4 border border-gray-300 rounded-xl resize-vertical h-24 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
          
          {/* Preview Editor */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border">
            <h3 className="text-2xl font-semibold mb-6 text-center">Resume Preview</h3>
            <div className="h-96 bg-gray-50 border-2 rounded-xl p-6 overflow-auto focus-within:ring-2 focus-within:ring-emerald-500">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                  <p>Generating resume...</p>
                </div>
              ) : content ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full h-full outline-none prose prose-sm max-w-none whitespace-pre-wrap"
                  onInput={(e) => setContent(e.currentTarget.innerText)}
                >
                  {content}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                  <div className="text-3xl mb-4">📄</div>
                  <p>Select template and click Generate</p>
                  <p className="text-sm mt-2">AI-generated resume with real-time editing</p>
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={generateResume}
                disabled={isLoading}
                className="flex-1 bg-emerald-600 disabled:bg-emerald-400 hover:bg-emerald-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                {isLoading ? 'Generating...' : 'Generate Resume'}
              </button>
              <button
                onClick={downloadResume}
                disabled={!content}
                className="flex-1 bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Download MD
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

