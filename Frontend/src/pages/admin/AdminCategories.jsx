import React, { useEffect, useState } from 'react'
import { Trash2, Pencil, Plus, X, Layers } from 'lucide-react'
import api, { getErrorMessage } from '../../api/axios.js'
import Spinner from '../../components/Spinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Alert from '../../components/Alert.jsx'

const emptyForm = { name: '', icon: '📘', description: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    try {
      const { data } = await api.get('/categories')
      setCategories(data.categories)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(cat) {
    setForm({ name: cat.name, icon: cat.icon, description: cat.description })
    setEditingId(cat.id)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Category name is required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form)
        setSuccess('Category updated successfully.')
      } else {
        await api.post('/categories', form)
        setSuccess('Category added successfully.')
      }
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
    if (!window.confirm('Delete this category and all its questions? This cannot be undone.')) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Spinner full />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage quiz categories</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <Alert message={error} />
      <Alert type="success" message={success} />

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                maxLength={4}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState icon={Layers} title="No categories yet" description="Add your first quiz category to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-xl">{cat.icon}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-primary-600">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-3">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.question_count} Questions</p>
              {cat.description && <p className="text-sm text-gray-500 mt-2">{cat.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
