'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, CreditCard, Shield, Bell, Lock, LogOut, Save, Loader2, Check } from 'lucide-react';
import { getClientSession } from '@/components/ui/auth-utils';
import { cn } from '@/lib/utils';

type TabType = 'profile' | 'security' | 'notifications' | 'billing';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    company: '',
  });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, marketing: false });

  useEffect(() => {
    const checkSession = async () => {
      const s = await getClientSession();
      setSession(s);
      if (!s?.user?.id) { router.push('/login'); return; }
      // Set mock data for demo
      setProfile({ name: s.user.name || 'John Doe', email: s.user.email || 'john@example.com', phone: '+92 300 1234567', location: 'Karachi, Sindh', company: 'Sartrends AI' });
      setLoading(false);
    };
    checkSession();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ] as const;

  if (loading) return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1><p className="text-gray-600">Manage your profile and preferences</p></div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 pb-4 mb-4 border-b">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">{profile.name.charAt(0)}</div>
                  <div><p className="font-semibold text-gray-900">{profile.name}</p><p className="text-sm text-gray-500">{profile.email}</p></div>
                </div>
                <nav className="space-y-1">
                  {tabs.map((tab) => (<Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'ghost'} onClick={() => setActiveTab(tab.id)} className={cn('w-full justify-start gap-2', activeTab !== tab.id && 'text-gray-600')}><tab.icon className="h-4 w-4" />{tab.label}</Button>))}
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader><CardTitle>Profile Information</CardTitle><CardDescription>Update your personal details</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-2 block">Full Name</label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="pl-10" /></div></div>
                    <div><label className="text-sm font-medium mb-2 block">Email</label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="pl-10" /></div></div>
                    <div><label className="text-sm font-medium mb-2 block">Phone</label><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="pl-10" /></div></div>
                    <div><label className="text-sm font-medium mb-2 block">Location</label><div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="pl-10" /></div></div>
                  </div>
                  <div><label className="text-sm font-medium mb-2 block">Company</label><Input value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} /></div>
                  <div className="flex justify-end"><Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}</Button></div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Manage your password and security preferences</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <div><h4 className="font-medium text-gray-900 mb-4">Change Password</h4><div className="space-y-4 max-w-md">
                    <div><label className="text-sm font-medium mb-2 block">Current Password</label><Input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} /></div>
                    <div><label className="text-sm font-medium mb-2 block">New Password</label><Input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} /></div>
                    <div><label className="text-sm font-medium mb-2 block">Confirm New Password</label><Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} /></div>
                    <Button>Update Password</Button>
                  </div></div>
                  <div className="border-t pt-6"><h4 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4><div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div className="flex items-center gap-3"><Shield className="h-5 w-5 text-gray-600" /><div><p className="font-medium text-gray-900">2FA Status</p><p className="text-sm text-gray-500">Add an extra layer of security</p></div></div><Button variant="outline">Enable</Button></div></div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle><CardDescription>Choose how you want to be notified</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  {[{ key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' }, { key: 'sms', label: 'SMS Notifications', desc: 'Get text messages for important updates' }, { key: 'marketing', label: 'Marketing Emails', desc: 'Receive promotional offers and news' }].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div><p className="font-medium text-gray-900">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                      <button onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})} className={cn('w-12 h-6 rounded-full transition-colors', notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300')}><span className={cn('block w-5 h-5 bg-white rounded-full transition-transform', notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5')} /></button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card>
                <CardHeader><CardTitle>Billing & Subscription</CardTitle><CardDescription>Manage your subscription and payment methods</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white"><p className="text-sm opacity-80">Current Plan</p><p className="text-2xl font-bold">Premium</p><p className="text-sm opacity-80 mt-1">PKR 5,000/month</p></div>
                  <div><h4 className="font-medium text-gray-900 mb-4">Payment Method</h4><div className="p-4 border rounded-lg flex items-center gap-3"><CreditCard className="h-5 w-5 text-gray-600" /><div className="flex-1"><p className="font-medium text-gray-900">Visa ending in 4242</p><p className="text-sm text-gray-500">Expires 12/25</p></div><Button variant="outline" size="sm">Update</Button></div></div>
                  <div><h4 className="font-medium text-gray-900 mb-4">Billing History</h4><div className="space-y-2">
                    {[{ date: 'Mar 1, 2024', amount: 'PKR 5,000', status: 'Paid' }, { date: 'Feb 1, 2024', amount: 'PKR 5,000', status: 'Paid' }, { date: 'Jan 1, 2024', amount: 'PKR 5,000', status: 'Paid' }].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium text-gray-900">{invoice.amount}</p><p className="text-sm text-gray-500">{invoice.date}</p></div><span className="text-sm text-green-600 font-medium">{invoice.status}</span></div>
                    ))}
                  </div></div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
