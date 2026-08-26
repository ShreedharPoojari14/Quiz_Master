import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api, { getErrorMessage } from '../api/axios.js'
import Alert from '../components/Alert.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    if (form.newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setStatus({ type: 'success', message: data.message })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setStatus({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-10 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-primary-600 font-medium mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
        <Alert type={status.type || 'error'} message={status.message} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
