import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, FileText, MessageCircle, Truck, Shield, Code, Palette, Bot, ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Services - Sartrends AI',
  description: 'Professional AI services for careers and businesses',
};

const services = [
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'AI-powered resume creation with ATS-optimized templates. Stand out to recruiters.',
    features: ['ATS-optimized', 'Multiple templates', 'Real-time preview', 'PDF export'],
    color: 'bg-blue-500',
  },
  {
    icon: MessageCircle,
    title: 'AI Chat Assistant',
    description: 'Powered by local Ollama. Your data stays local - completely private and free to use.',
    features: ['Local AI only', 'No data leaves device', '24/7 available', 'Free to use'],
    color: 'bg-purple-500',
  },
  {
    icon: Shield,
    title: 'HSE Documents',
    description: 'Generate compliance-ready health and safety documents for any industry.',
    features: ['Trucking HSE', 'Office Safety', 'Construction', 'Custom docs'],
    color: 'bg-orange-500',
  },
  {
    icon: Truck,
    title: 'Dispatch System',
    description: 'Find and manage loads for your trucking business. Connect with shippers.',
    features: ['Load marketplace', 'Real-time updates', 'Easy booking', 'Track loads'],
    color: 'bg-green-500',
  },
  {
    icon: Code,
    title: 'Custom AI Solutions',
    description: 'Tailored AI systems for your business needs. From automation to analytics.',
    features: ['Custom models', 'API integration', 'Training', 'Support'],
    color: 'bg-red-500',
  },
  {
    icon: Palette,
    title: 'Creative Studio',
    description: 'AI-powered creative tools for content, images, and design ideas.',
    features: ['Content generation', 'Design suggestions', 'Layout ideas', 'Copywriting'],
    color: 'bg-pink-500',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Powerful AI tools to help you build your career and grow your business
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}>
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register">
                  <Button className="w-full gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need something custom?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We build tailored AI solutions for businesses of all sizes
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 rounded-xl">
                Contact Us
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10 rounded-xl">
                Try Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

