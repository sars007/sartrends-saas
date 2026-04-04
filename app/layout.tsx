import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { auth } from '@/lib/auth'
import { cookies } from 'next/headers'
import { isPR, getPRNumber } from '@/lib/env'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sartrends AI SaaS - Build Career & Business with AI',
  description: 'All-in-one AI tools, services marketplace, dispatch system',
}

async function getSession() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(auth.sessionCookieName)
  if (!sessionCookie) return null
  return await auth.getSession(sessionCookie.value)
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const prNumber = getPRNumber();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {isPR() && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white p-2 text-center text-sm font-medium">
            Preview: Pull Request #{prNumber || 'unknown'}
          </div>
        )}
        
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sartrends AI
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Home</Link>
                <Link href="/ai" className="text-gray-700 hover:text-blue-600 font-medium transition">AI Tools</Link>
                <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium transition">Services</Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">Dashboard</Link>
                <Link href="/subscriptions" className="text-gray-700 hover:text-blue-600 font-medium transition">Subscribe</Link>
              </div>
              
              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {session ? (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen pt-4 pb-20">
          {children}
        </main>

        {/* WhatsApp FAB */}
        <a 
          href="https://wa.me/923454837460?text=Hi%2C%20I%27m%20interested%20in%20Sartrends%20AI%20services!"
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16 flex items-center justify-center"
          aria-label="WhatsApp Chat"
        >
          💬
        </a>
      </body>
    </html>
  )
}

