import React, { useEffect, useState } from 'react'
import { Trash2, Users as UsersIcon, ShieldCheck } from 'lucide-react'
import api, { getErrorMessage } from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../../components/Spinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Alert from '../../components/Alert.jsx'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      const { data } = await api.get('/users')
      setUsers(data.users)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? Their quiz history will also be removed.')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleRoleChange(id, role) {
    try {
      await api.put(`/users/${id}/role`, { role })
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Spinner full />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Users</h1>
      <p className="text-gray-500 mb-6">{users.length} registered users</p>

      <Alert message={error} />

      {users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users yet" />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-3 px-5 font-medium">Name</th>
                <th className="py-3 px-5 font-medium">Email</th>
                <th className="py-3 px-5 font-medium">Role</th>
                <th className="py-3 px-5 font-medium">Points</th>
                <th className="py-3 px-5 font-medium">Quizzes</th>
                <th className="py-3 px-5 font-medium">Joined</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 px-5 font-medium text-gray-800">{u.name}</td>
                  <td className="py-3 px-5 text-gray-500">{u.email}</td>
                  <td className="py-3 px-5">
                    <select
                      value={u.role}
                      disabled={u.id === currentUser?.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2 py-1 rounded-md border border-gray-200 text-xs bg-white disabled:opacity-50"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-5 text-gray-600">{u.points}</td>
                  <td className="py-3 px-5 text-gray-600">{u.quizzes_taken}</td>
                  <td className="py-3 px-5 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-5 text-right">
                    {u.id === currentUser?.id ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <ShieldCheck size={14} /> You
                      </span>
                    ) : (
                      <button onClick={() => handleDelete(u.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
