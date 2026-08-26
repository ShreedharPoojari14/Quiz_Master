import React, { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Alert from '../components/Alert.jsx'

const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-700']

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/leaderboard')
        setLeaders(data.leaders)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spinner full />

  return (
    <div className="container-page py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
          <Trophy size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-500 text-sm">Top scorers ranked by total points</p>
        </div>
      </div>

      <Alert message={error} />

      {leaders.length === 0 ? (
        <EmptyState icon={Trophy} title="No rankings yet" description="Complete a quiz to appear on the leaderboard." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card divide-y divide-gray-50">
          {leaders.map((leader, idx) => (
            <div
              key={leader.id}
              className={`flex items-center gap-4 px-5 py-4 ${
                leader.id === user?.id ? 'bg-primary-50/50' : ''
              }`}
            >
              <span
                className={`w-8 text-center font-bold ${
                  idx < 3 ? medalColors[idx] : 'text-gray-400'
                }`}
              >
                {idx + 1}
              </span>
              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm shrink-0">
                {leader.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {leader.name} {leader.id === user?.id && <span className="text-xs text-primary-600">(You)</span>}
                </p>
                <p className="text-xs text-gray-400">{leader.quizzes_taken} quizzes taken</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">{leader.points}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
