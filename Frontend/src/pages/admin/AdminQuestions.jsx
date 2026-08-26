import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Pencil, Plus, HelpCircle } from 'lucide-react'
import api, { getErrorMessage } from '../../api/axios.js'
import Spinner from '../../components/Spinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Alert from '../../components/Alert.jsx'

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      const [qRes, cRes] = await Promise.all([api.get('/questions'), api.get('/categories')])
      setQuestions(qRes.data.questions)
      setCategories(cRes.data.categories)
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
    if (!window.confirm('Delete this question?')) return
    try {
      await api.delete(`/questions/${id}`)
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Spinner full />

  const filtered = filter ? questions.filter((q) => String(q.category_id) === filter) : questions

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-500 mt-1">{questions.length} total questions</p>
        </div>
        <Link
          to="/admin/questions/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Add Question
        </Link>
      </div>

      <Alert message={error} />

      <div className="mb-5">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No questions found"
          description="Add a question to get started."
          action={
            <Link to="/admin/questions/new" className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold">
              Add Question
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card divide-y divide-gray-50">
          {filtered.map((q) => (
            <div key={q.id} className="p-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wide text-primary-600 bg-primary-50 px-2 py-0.5 rounded mb-1.5">
                  {q.category_name}
                </span>
                <p className="font-medium text-gray-800">{q.question}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Correct: {q[`option${q.correct_option}`]}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/admin/questions/${q.id}/edit`} className="text-gray-400 hover:text-primary-600">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => handleDelete(q.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
