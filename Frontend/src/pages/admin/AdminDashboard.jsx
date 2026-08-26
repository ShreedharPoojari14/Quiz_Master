import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Users, Layers, BarChart3, ArrowRight } from 'lucide-react'
import api, { getErrorMessage } from '../../api/axios.js'
import Spinner from '../../components/Spinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Alert from '../../components/Alert.jsx'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/dashboard/admin')
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
    { label: 'Total Questions', value: stats?.total_questions ?? 0, icon: HelpCircle, color: 'text-primary-600 bg-primary-50' },
    { label: 'Total Users', value: stats?.total_users ?? 0, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Total Categories', value: stats?.total_categories ?? 0, icon: Layers, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Total Results', value: stats?.total_results ?? 0, icon: BarChart3, color: 'text-pink-600 bg-pink-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Overview of QuizMaster activity</p>

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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Quiz Results</h2>
          <Link to="/admin/results" className="text-primary-600 text-sm font-medium flex items-center gap-1">
            View All Results <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState icon={BarChart3} title="No results yet" description="Results will appear once students take quizzes." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-2 pr-4 font-medium">User</th>
                  <th className="py-2 pr-4 font-medium">Quiz</th>
                  <th className="py-2 pr-4 font-medium">Score</th>
                  <th className="py-2 pr-4 font-medium">Percentage</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-800">{r.user_name}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.category_name}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.score}/{r.total}</td>
                    <td className="py-3 pr-4 font-semibold text-primary-600">{r.percentage}%</td>
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
