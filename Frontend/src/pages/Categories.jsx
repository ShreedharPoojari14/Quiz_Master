import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, ArrowRight } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Alert from '../components/Alert.jsx'

const palette = [
  'bg-yellow-50 text-yellow-600',
  'bg-blue-50 text-blue-600',
  'bg-green-50 text-green-600',
  'bg-pink-50 text-pink-600',
  'bg-purple-50 text-purple-600',
  'bg-cyan-50 text-cyan-600',
]

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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
    load()
  }, [])

  if (loading) return <Spinner full label="Loading categories..." />

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-1">Choose a category to start the quiz</p>
      </div>

      <Alert message={error} />

      {categories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No categories yet"
          description="Categories will show up here once an admin adds them."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const disabled = cat.question_count === 0
            return (
              <button
                key={cat.id}
                disabled={disabled}
                onClick={() => navigate(`/quiz/${cat.id}`)}
                className={`text-left rounded-2xl p-6 border border-gray-100 shadow-card transition-all bg-white ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-soft hover:-translate-y-1'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${
                    palette[i % palette.length]
                  }`}
                >
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{cat.question_count} Questions</p>
                {!disabled && (
                  <div className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-4">
                    Start Quiz <ArrowRight size={15} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
