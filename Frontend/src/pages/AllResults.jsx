import React, { useEffect, useState } from 'react'
import { ListChecks } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Alert from '../components/Alert.jsx'

export default function AllResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/results/mine')
        setResults(data.results)
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
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Quiz Results</h1>
      <Alert message={error} />

      {results.length === 0 ? (
        <EmptyState icon={ListChecks} title="No results yet" description="Take a quiz to see your history here." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-3 px-5 font-medium">Quiz Name</th>
                <th className="py-3 px-5 font-medium">Score</th>
                <th className="py-3 px-5 font-medium">Percentage</th>
                <th className="py-3 px-5 font-medium">Correct</th>
                <th className="py-3 px-5 font-medium">Wrong</th>
                <th className="py-3 px-5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 px-5 font-medium text-gray-800">{r.category_name}</td>
                  <td className="py-3 px-5 text-gray-600">
                    {r.score}/{r.total}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`font-semibold ${
                        r.percentage >= 70 ? 'text-green-600' : r.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}
                    >
                      {r.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-5 text-green-600">{r.correct_count}</td>
                  <td className="py-3 px-5 text-red-500">{r.wrong_count}</td>
                  <td className="py-3 px-5 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
