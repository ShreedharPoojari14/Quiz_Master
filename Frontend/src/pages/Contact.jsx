import React, { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import Alert from '../components/Alert.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    setSubmitting(true)
    setStatus({ type: '', message: '' })
    try {
      const { data } = await api.post('/contact', form)
      setStatus({ type: 'success', message: data.message })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-600 mb-8">Have any questions or suggestions? Feel free to contact us.</p>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </span>
              <div>
                <div className="text-xs text-gray-400">Email</div>
                <div className="text-sm font-medium text-gray-800">support@quizmaster.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </span>
              <div>
                <div className="text-xs text-gray-400">Phone</div>
                <div className="text-sm font-medium text-gray-800">+91 98765-43210</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </span>
              <div>
                <div className="text-xs text-gray-400">Address</div>
                <div className="text-sm font-medium text-gray-800">123, College Road, City, Country - 400001</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-7">
          <Alert type={status.type || 'error'} message={status.message} />
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                rows={5}
                placeholder="Type your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
