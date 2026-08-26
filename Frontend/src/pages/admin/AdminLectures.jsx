import React, { useEffect, useState } from 'react'
import { Trash2, Plus, X, BookOpen } from 'lucide-react'
import api, { getErrorMessage } from '../../api/axios.js'
import Spinner from '../../components/Spinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Alert from '../../components/Alert.jsx'

const emptyForm = { category_id: '', title: '', content: '' }

export default function AdminLectures() {
  const [lectures, setLectures] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load() {
    try {
      const [lecRes, catRes] = await Promise.all([api.get('/lectures'), api.get('/categories')])
      setLectures(lecRes.data.lectures)
      setCategories(catRes.data.categories)
      if (catRes.data.categories.length > 0) {
        setForm((f) => ({ ...f, category_id: f.category_id || catRes.data.categories[0].id }))
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.category_id) return setError('Please select a category.')
    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters.')
    if (form.content.trim().length < 10) return setError('Content must be at least 10 characters.')

    setSubmitting(true)
    try {
      await api.post('/lectures', form)
      setSuccess('Lecture added successfully.')
      setForm({ ...emptyForm, category_id: form.category_id })
      setShowForm(false)
      load()
      setTimeout(() => setSuccess(''), 2500)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this lecture?')) return
    try {
      await api.delete(`/lectures/${id}`)
      setLectures((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lectures</h1>
          <p className="text-gray-500 mt-1">Manage lecture material for students</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Close' : 'Add Lecture'}
        </button>
      </div>

      <Alert message={error} />
      <Alert type="success" message={success} />

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
              <textarea
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Saving...' : 'Add Lecture'}
            </button>
          </form>
        </div>
      )}

      {lectures.length === 0 ? (
        <EmptyState icon={BookOpen} title="No lectures yet" description="Add lecture material for your students." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card divide-y divide-gray-50">
          {lectures.map((lec) => (
            <div key={lec.id} className="p-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-primary-600 bg-primary-50 px-2 py-0.5 rounded mb-1.5">
                  {lec.category_name}
                </span>
                <p className="font-medium text-gray-800">{lec.title}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{lec.content}</p>
              </div>
              <button onClick={() => handleDelete(lec.id)} className="text-gray-400 hover:text-red-600 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
