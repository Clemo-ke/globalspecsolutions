'use client'

import React, { useState } from 'react'
import { Trash2, ShieldCheck, UserCog } from 'lucide-react'

interface Props {
  usersList: any[]
  rolesList: any[]
  currentUserId: string | null
  flash: (msg: string, ok?: boolean) => void
}

export function UsersManager({ usersList, rolesList, currentUserId, flash }: Props) {
  const [users, setUsers] = useState<any[]>(usersList)

  const roleOptions = rolesList.filter((r) => r.slug !== 'customer').map((r) => r.slug)

  const changeRole = async (u: any, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (res.ok) {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)))
        flash(`${u.email} → ${role}`)
      } else {
        flash('Failed to update user role', false)
      }
    } catch {
      flash('Failed to update user role', false)
    }
  }

  const remove = async (u: any) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setUsers((prev) => prev.filter((x) => x.id !== u.id))
        flash(`User ${u.email} deleted`)
      } else {
        flash(data.error || 'Failed to delete user', false)
      }
    } catch {
      flash('Failed to delete user', false)
    }
  }

  const badge = (role: string) => {
    switch (role) {
      case 'super-admin': return 'bg-red-50 text-red-600 border-red-200'
      case 'admin': return 'bg-primary/10 text-primary border-primary/30'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Registered users and their platform roles. Assign roles to control admin access and permissions.</p>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase font-semibold border-b border-gray-100">
              <tr>{['User', 'Email', 'Role', 'Created', 'Actions'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600 shrink-0">
                        {(u.name || u.email || '?').charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium text-gray-800">{u.name || '—'}</span>
                      {u.id === currentUserId && <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">You</span>}
                    </div>
                  </td>
                  <td className="p-3 text-gray-500">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role || 'customer'}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${badge(u.role || 'customer')}`}
                    >
                      <option value="customer">customer</option>
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg border border-gray-200 text-gray-400" title="Manage permissions in Roles tab">
                        <UserCog className="w-3.5 h-3.5" />
                      </span>
                      <button
                        onClick={() => remove(u)}
                        disabled={u.id === currentUserId}
                        className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
                        title={u.id === currentUserId ? 'You cannot delete your own account' : 'Delete user'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-gray-300" /> No registered users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
