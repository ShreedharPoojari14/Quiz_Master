import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../../api/axios.js'
import Alert from '../../components/Alert.jsx'
import Spinner from '../../components/Spinner.jsx'

const emptyForm = {
  category_id: '',
  question: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correct_option: 1,
}

export default function AddQuestion() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/categories')
        setCategories(data.categories)
        if (isEditing) {
          const { data: qData } = await api.get('/questions')
          const existing = qData.questions.find((q) => String(q.id) === id)
          if (existing) {
            setForm({
              category_id: existing.category_id,
              question: existing.question,
              option1: existing.option1,
              option2: existing.option2,
              option3: existing.option3,
              option4: existing.option4,
              correct_option: existing.correct_option,
            })
          }
        } else if (data.categories.length > 0) {
          setForm((f) => ({ ...f, category_id: data.categories[0].id }))
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEditing])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.category_id) return setError('Please select a category.')
    if (form.question.trim().length < 5) return setError('Question must be at least 5 characters.')
    if (!form.option1 || !form.option2 || !form.option3 || !form.option4) {
      return setError('All four options are required.')
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        await api.put(`/questions/${id}`, form)
        setSuccess('Question updated successfully.')
      } else {
        await api.post('/questions', form)
        setSuccess('Question added successfully.')
        setForm({ ...emptyForm, category_id: form.category_id })
      }
      setTimeout(() => setSuccess(''), 2500)
      if (isEditing) setTimeout(() => navigate('/admin/questions'), 800)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner full />

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{isEditing ? 'Edit Question' : 'Add Question'}</h1>
      <p className="text-gray-500 mb-6">Select Category</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <Alert message={error} />
        <Alert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
            >
              {categories.length === 0 && <option value="">No categories available</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
            <textarea
              rows={3}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Enter the question"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
            />
          </div>

          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Option {n}</label>
              <input
                type="text"
                value={form[`option${n}`]}
                onChange={(e) => setForm({ ...form, [`option${n}`]: e.target.value })}
                placeholder={`Enter option ${n}`}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Correct Option</label>
            <select
              value={form.correct_option}
              onChange={(e) => setForm({ ...form, correct_option: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
            >
              <option value={1}>Option 1</option>
              <option value={2}>Option 2</option>
              <option value={3}>Option 3</option>
              <option value={4}>Option 4</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting || categories.length === 0}
            className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Question' : 'Add Question'}
          </button>
          {categories.length === 0 && (
            <p className="text-xs text-red-500">Please add a category first before creating questions.</p>
          )}
        </form>
      </div>
    </div>
  )
}
