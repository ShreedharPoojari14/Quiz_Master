import React, { useEffect, useState } from 'react'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Alert from '../components/Alert.jsx'

export default function Lectures() {
  const { refreshUser } = useAuth()
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [completingId, setCompletingId] = useState(null)
  const [toast, setToast] = useState('')

  async function load() {
    try {
      const { data } = await api.get('/lectures')
      setLectures(data.lectures)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function markComplete(id) {
    setCompletingId(id)
    try {
      const { data } = await api.post(`/lectures/${id}/complete`)
      setLectures((prev) => prev.map((l) => (l.id === id ? { ...l, completed: true } : l)))
      if (data.points_earned > 0) {
        setToast(`+${data.points_earned} points earned!`)
        refreshUser()
        setTimeout(() => setToast(''), 2500)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCompletingId(null)
    }
  }

  if (loading) return <Spinner full />

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Lectures</h1>
      <p className="text-gray-500 mb-6">Read through a lecture and mark it complete to earn points.</p>

      <Alert message={error} />
      {toast && (
        <div className="fixed top-20 right-6 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {lectures.length === 0 ? (
        <EmptyState icon={BookOpen} title="No lectures yet" description="Check back soon for new lecture material." />
      ) : (
        <div className="space-y-4">
          {lectures.map((lec) => (
            <div key={lec.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <button
                onClick={() => setExpandedId(expandedId === lec.id ? null : lec.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <BookOpen size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">{lec.title}</p>
                    <p className="text-xs text-gray-400">{lec.category_name}</p>
                  </div>
                </div>
                {lec.completed && <CheckCircle2 size={20} className="text-green-500 shrink-0" />}
              </button>

              {expandedId === lec.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <p className="text-sm text-gray-600 leading-relaxed">{lec.content}</p>
                  <div className="mt-4">
                    {lec.completed ? (
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => markComplete(lec.id)}
                        disabled={completingId === lec.id}
                        className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors"
                      >
                        {completingId === lec.id ? 'Marking...' : 'Mark as Complete (+10 pts)'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
