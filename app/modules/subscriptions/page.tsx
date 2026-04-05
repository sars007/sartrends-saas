import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Star, Crown, ArrowRight, Loader2 } from 'lucide-react';

async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('auth_session');
  if (!sessionCookie) return null;
  return await auth.getSession(sessionCookie.value);
}

const freeFeatures = [
  '50 AI credits/month',
  'Basic resume templates',
  '3 document downloads',
  'AI chat assistant',
  'Community support',
];

const premiumFeatures = [
  '500 AI credits/month',
  'Premium resume templates',
  'Unlimited downloads',
  'Priority AI processing',
  'HSE documents',
  'Cover letter generator',
  'Priority support',
  'Early access to new features',
];

export default async function Subscriptions() {
  const session = await getCurrentUser();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose your <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more power
          </p>
        </div>

        {user?.isPaid ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Premium Active</h2>
                <p className="text-blue-100">Thank you for your support!</p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{user.plan || 'PRO'}</div>
                    <div className="text-sm text-emerald-700 font-medium">Current Plan</div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-3xl font-bold text-gray-900 mb-1">500</div>
                    <div className="text-sm text-gray-600 font-medium">AI Credits Remaining</div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-4">Your premium benefits:</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {premiumFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600 text-sm">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">PKR 0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-green-500" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full py-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-3xl border-2 border-blue-500 shadow-xl p-8 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Premium
                </h3>
                <p className="text-gray-600 text-sm">For professionals who need more</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">PKR 5,000</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-green-500" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => document.getElementById('premium')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Star className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}

        {!user?.isPaid && (
          <div id="premium" className="mt-16 max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
                <p className="text-gray-600">Complete your payment via the methods below</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-600" />
                    Easypaisa
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">+92 345 4837460</p>
                  <p className="text-sm text-gray-500 mt-1">Scan QR or send to this number</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-3">Meezan Bank</h3>
                  <p className="text-lg font-bold text-gray-900">77010105779192</p>
                  <p className="text-sm text-gray-500 mt-1">IBAN: PK59MEZN0077010105779192</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Upload Payment Proof</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2">Drop your screenshot here or click to upload</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                  <Button className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Loader2 className="mr-2 h-5 w-5" />
                    Submit for Verification
                  </Button>
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm mt-6 flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Admin will verify within 24 hours and activate your premium
              </p>
            </div>
          </div>
        )}

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
              { q: 'What if I run out of credits?', a: 'You can purchase additional credits or upgrade to premium for more.' },
              { q: 'How do I get support?', a: 'Premium users get priority support. Free users can use community support.' },
              { q: 'Is my data secure?', a: 'Absolutely. All AI processing is done locally and we never share your data.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

