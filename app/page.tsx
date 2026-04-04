import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, FileText, MessageCircle, Truck, Shield, ArrowRight, Check, Lock, Users } from 'lucide-react'
import { ServicesSlider } from '@/app/components/services-slider'



export const metadata: Metadata = {
  title: 'Sartrends AI - Build Your Career & Business with AI',
  description: 'Create professional resumes, documents, manage dispatch, and use AI tools - all in one place.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.1),_transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
              <Star className="h-4 w-4" />
              Powered by Local AI - 100% Free
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Build your career and
              <span className="block text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                business using AI
              </span>
              in one place
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Create resumes, documents, manage dispatch, and use AI tools easily. 
              All powered by local AI - no paid APIs, no external services.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg shadow-blue-500/25">
                  <Star className="mr-2 h-5 w-5" />
                  Start with AI
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                  Hire Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <p className="mt-8 text-gray-500 text-sm">
              Trusted by professionals and growing businesses
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools to supercharge your career and business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Resume Builder', desc: 'AI-powered resume creation with ATS-optimized templates', color: 'bg-blue-500' },
              { icon: MessageCircle, title: 'AI Chat', desc: 'Ask anything - powered by local Ollama (llama3)', color: 'bg-purple-500' },
              { icon: Shield, title: 'HSE Documents', desc: 'Generate safety documents for trucking, office, construction', color: 'bg-orange-500' },
              { icon: Truck, title: 'Dispatch System', desc: 'Find and manage loads for your trucking business', color: 'bg-green-500' },
              { icon: Users, title: 'Cover Letters', desc: 'Professional cover letters tailored to job applications', color: 'bg-pink-500' },
              { icon: Star, title: 'Fast & Local', desc: 'All AI runs locally - no data leaves your machine', color: 'bg-yellow-500' },
            ].map((feature) => (
              <div key={feature.title} className="group p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSlider />

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and get started instantly' },
              { step: '02', title: 'Choose Tool', desc: 'Select from AI resume, documents, chat, or dispatch' },
              { step: '03', title: 'Get Results', desc: 'AI generates professional output in seconds' },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
                )}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What users say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied professionals</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmed Khan', role: 'Fleet Manager', text: 'The dispatch system helped me find loads 3x faster. Game changer!', rating: 5 },
              { name: 'Sara Ali', role: 'Software Engineer', text: 'Created a professional resume in minutes. Got interview calls right away.', rating: 5 },
              { name: 'Muhammad Rashid', role: 'Safety Officer', text: 'HSE documents generated are comprehensive and compliant. Highly recommend!', rating: 5 },
            ].map((testimonial) => (
              <div key={testimonial.name} className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">{testimonial.text}</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you need more</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-white border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">PKR 0<span className="text-lg font-normal text-gray-500">/month</span></div>
              <ul className="space-y-4 mb-8">
                {['50 AI credits', 'Basic resume builder', 'Document generation', 'Community support'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-green-500" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block">
                <Button className="w-full" variant="outline">Get Started</Button>
              </Link>
            </div>
            
            {/* Pro - Featured */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white relative transform scale-105">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">PKR 5,000<span className="text-lg font-normal text-blue-200">/month</span></div>
              <ul className="space-y-4 mb-8">
                {['500 AI credits', 'Advanced resume templates', 'Unlimited documents', 'Priority support', 'HSE documents'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-blue-100">
                    <Check className="h-5 w-5 text-yellow-300" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="block">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">Upgrade Now</Button>
              </Link>
            </div>
            
            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-white border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                {['Unlimited credits', 'Custom AI models', 'API access', 'Dedicated support', 'White-label'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-green-500" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="block">
                <Button className="w-full" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of professionals using AI to build their careers and businesses
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 rounded-xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10 rounded-xl">
                Talk to Sales
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-200">
            <Lock className="h-4 w-4" />
            No credit card required • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Sartrends AI</span>
            </div>
            <p className="text-sm">© 2024 Sartrends AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
