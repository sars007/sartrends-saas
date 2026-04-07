'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users2, UserPlus, Trash2, Edit } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  email: string
  name: string | null
  credits: number
  plan: string
  role: string
  createdAt: string
}

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users?role=user', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
        credentials: 'include'
      })
      if (res.ok) {
        fetchUsers()
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Failed to update user')
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div>Loading users...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Users2 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold">Users Panel</h1>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Admin
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Credits</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge variant={user.plan === 'free' ? 'secondary' : 'default'}>
                        {user.plan.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-mono">{user.credits}</td>
                    <td className="py-4 px-4">
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {editingUser?.id === user.id ? (
                          <>
                            <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" onClick={() => updateUser(editingUser)}>
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingUser(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


