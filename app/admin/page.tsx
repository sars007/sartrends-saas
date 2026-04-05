'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, Zap, FileText, LogOut, ChevronLeft, Users2, BarChart3, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  isPaid: boolean;
  plan: string;
  isAdmin: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      router.push('/auth/login');
    }
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: string; label: string; icon: React.ElementType }) => (
    <Button
      variant={activeTab === tab ? 'default' : 'outline'}
      className="flex-1"
      onClick={() => setActiveTab(tab)}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Full control panel</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 mb-12">
          <TabButton tab="dashboard" label="Dashboard" icon={BarChart3} />
          <TabButton tab="flags" label="Features" icon={Zap} />
          <TabButton tab="ai" label="AI Config" icon={Users2} />
          <TabButton tab="site" label="Site" icon={FileText} />
          <TabButton tab="media" label="Media" icon={Image} />
          <TabButton tab="users" label="Users" icon={Users2} />
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Manage Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Plan</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Credits</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.email}</p>
                              <p className="text-sm text-gray-500">{user.name}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.isPaid ? 'default' : 'secondary'}>
                              {user.plan.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-gray-900">{user.credits}</td>
                          <td className="py-3 px-4">
                            <Badge variant={user.isAdmin ? 'destructive' : 'default'}>
                              {user.isAdmin ? 'Admin' : user.isPaid ? 'Paid' : 'Free'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="destructive" size="sm">Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button className="mt-4" variant="outline">
                  Refresh Users
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'tools' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI SEO Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Enabled</span>
                    <Button variant="outline" size="sm">Toggle</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Enabled</span>
                    <Button variant="outline" size="sm">Toggle</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Sales Copy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Enabled</span>
                    <Button variant="outline" size="sm">Toggle</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Enabled</span>
                    <Button variant="outline" size="sm">Toggle</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'content' && (
            <Card>
              <CardHeader>
                <CardTitle>Homepage Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Hero Section</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Services Slider</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Features</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="text-4xl font-bold text-blue-600 mb-2">1,234</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">567</div>
                    <div className="text-gray-600">Active Subscriptions</div>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-4xl font-bold text-purple-600 mb-2">89%</div>
                    <div className="text-gray-600">Retention Rate</div>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                    <div className="text-4xl font-bold text-orange-600 mb-2">PKR 2.3M</div>
                    <div className="text-gray-600">Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


