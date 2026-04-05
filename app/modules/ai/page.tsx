export const dynamic = 'force-dynamic'

'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, Send, Copy, Check, Loader2, AlertCircle, Trash2, MessageCircle, FileText, Briefcase, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'Resume Builder', icon: FileText, color: 'bg-blue-500' },
  { label: 'Cover Letter', icon: Briefcase, color: 'bg-emerald-500' },
  { label: 'HSE Document', icon: Shield, color: 'bg-orange-500' },
  { label: 'General Chat', icon: MessageCircle, color: 'bg-purple-500' },
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.response || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-gray-600">Powered by local Ollama • llama3</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="outline" onClick={clearChat} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        {!messages.length && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => setInput(`Help me with ${action.label.toLowerCase()}`)}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-280px)]">
          {/* Input Panel */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Your Message
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything... Create a resume, write a cover letter, generate documents, or just chat!"
                  className="flex-1 resize-none border-gray-200 focus:ring-2 focus:ring-blue-500/20"
                  disabled={loading}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  AI Response
                </h2>
                {messages.length > 0 && (
                  <span className="text-sm text-gray-500">{messages.length} messages</span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700">Error</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {messages.length === 0 && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Star className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Help</h3>
                    <p className="text-gray-600 max-w-md">
                      Ask me anything! I can help with resumes, cover letters, documents, 
                      HSE safety papers, or just have a conversation.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'p-4 rounded-xl animate-[slideUp_0.3s_ease-out_forwards]',
                      message.role === 'user'
                        ? 'bg-blue-50 border border-blue-100 ml-8'
                        : 'bg-gray-50 border border-gray-100 mr-8'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={cn(
                        'text-sm font-medium',
                        message.role === 'user' ? 'text-blue-600' : 'text-purple-600'
                      )}>
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}

                {loading && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mr-8">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

