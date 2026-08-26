import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, Percent, Award, Star, ArrowRight } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Alert from '../components/Alert.jsx'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/dashboard/student')
        setData(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spinner full />

  const stats = data?.stats
  const recent = data?.recent_results || []

  const cards = [
    { label: 'Quizzes Attempted', value: stats?.quizzes_attempted ?? 0, icon: ListChecks, color: 'text-primary-600 bg-primary-50' },
    { label: 'Average Score', value: `${stats?.average_score ?? 0}%`, icon: Percent, color: 'text-green-600 bg-green-50' },
    { label: 'Best Score', value: `${stats?.best_score ?? 0}%`, icon: Award, color: 'text-pink-600 bg-pink-50' },
    { label: 'Total Points', value: stats?.points ?? 0, icon: Star, color: 'text-yellow-600 bg-yellow-50' },
  ]

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
      </div>

      <Alert message={error} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {stats && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-semibold text-gray-800">Level {stats.level}</span>
              <span className="text-xs text-gray-400 ml-2">· {stats.badge} Badge</span>
            </div>
            <span className="text-xs text-gray-400">{stats.pointsToNextLevel} pts to next level</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
              style={{ width: `${stats.pointsIntoLevel}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Results</h2>
          <Link to="/results" className="text-primary-600 text-sm font-medium flex items-center gap-1">
            View All Results <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No quizzes taken yet"
            description="Head to categories and take your first quiz to see results here."
            action={
              <Link to="/categories" className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold">
                Browse Categories
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-2 pr-4 font-medium">Quiz Name</th>
                  <th className="py-2 pr-4 font-medium">Score</th>
                  <th className="py-2 pr-4 font-medium">Percentage</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-800">{r.category_name}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {r.score}/{r.total}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-semibold ${
                          r.percentage >= 70 ? 'text-green-600' : r.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}
                      >
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
