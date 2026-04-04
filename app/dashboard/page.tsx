import { auth } from '@/lib/auth'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CreditCard, FileText, MessageCircle, Truck, Download, Star } from 'lucide-react'
import { prisma } from '@/lib/db'
import { getUserCredits } from '@/lib/credits'

async function getSession() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get(auth.sessionCookieName)
  if (!sessionCookie) return null
  return await auth.getSession(sessionCookie.value)
}

export default async function Dashboard() {
  const session = await getSession()
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Dashboard</h1>
          <p className="text-xl text-gray-600 mb-8">Please log in to access your dashboard</p>
          <Link href="/auth/login">
            <Button size="lg" className="text-xl px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscriptions: { take: 1, orderBy: { createdAt: 'desc' } } }
  })

  const credits = user ? await getUserCredits(session.user.id) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/50 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name || user?.email}
              </h1>
              <p className="text-xl text-gray-600">Manage your AI tools, orders and subscription</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border">
                <Star className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-700">{credits}</div>
                <div className="text-sm text-emerald-600 font-medium">AI Credits</div>
              </div>
              <Link href="/subscriptions">
                <Button size="lg" className="px-8">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Manage Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/modules/resume" className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border hover:shadow-xl transition-all hover:-translate-y-1">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Resume Builder</h3>
                  <p className="text-gray-600 text-sm text-center">AI Resume & Cover Letter</p>
                </Link>
                <Link href="/modules/ai" className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border hover:shadow-xl transition-all hover:-translate-y-1">
                  <Star className="h-12 w-12 text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">AI Chat</h3>
                  <p className="text-gray-600 text-sm text-center">Ask anything</p>
                </Link>
                <Link href="/modules/documents" className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 border hover:shadow-xl transition-all hover:-translate-y-1">
                  <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Documents</h3>
                  <p className="text-gray-600 text-sm text-center">HSE & Office Docs</p>
                </Link>
                <Link href="/modules/orders" className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 border hover:shadow-xl transition-all hover:-translate-y-1">
                  <Users className="h-12 w-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">My Orders</h3>
                  <p className="text-gray-600 text-sm text-center">Active Projects</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl h-fit sticky top-32">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Stats</h3>
              
              {/* Subscription */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Subscription
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
                  {user?.isPaid ? (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{user.plan.toUpperCase()}</div>
                      <p className="text-sm text-emerald-700">Active</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-500 mb-1">Free</div>
                      <p className="text-sm text-gray-500">Upgrade for unlimited</p>
                    </div>
                  )}
                  <Link href="/subscriptions" className="block mt-4 w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Plan
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  Recent Activity
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <FileText className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Resume Generated</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <MessageCircle className="h-8 w-8 text-emerald-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">New Order Inquiry</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Truck className="h-8 w-8 text-orange-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Dispatch Load Posted</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="mt-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                Recent Documents
              </h2>
              <Link href="/dashboard/documents" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="group p-6 border rounded-2xl hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Professional Resume</h4>
                    <p className="text-sm text-gray-500">AI Generated</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
              <div className="group p-6 border rounded-2xl hover:shadow-lg transition cursor-pointer opacity-50">
                <p className="text-sm text-gray-500 italic">No documents yet. Create your first one!</p>
              </div>
              <div className="group p-6 border rounded-2xl hover:shadow-lg transition cursor-pointer opacity-50">
                <p className="text-sm text-gray-500 italic">No documents yet. Create your first one!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

