import React, { useEffect, useState } from 'react'
import { BarChart3, Search } from 'lucide-react'
import api, { getErrorMessage } from '../../api/axios.js'
import Spinner from '../../components/Spinner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Alert from '../../components/Alert.jsx'

export default function AdminResults() {
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [userFilter, setUserFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  async function load(params = {}) {
    try {
      const { data } = await api.get('/results', { params })
      setResults(data.results)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const { data } = await api.get('/categories')
        setCategories(data.categories)
      } catch (err) {
        // non-fatal
      }
      load()
    }
    init()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    setSearching(true)
    load({
      user: userFilter || undefined,
      category_id: categoryFilter || undefined,
    })
  }

  function handleReset() {
    setUserFilter('')
    setCategoryFilter('')
    setLoading(true)
    load()
  }

  if (loading) return <Spinner full />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">View Results</h1>
      <p className="text-gray-500 mb-6">All student quiz attempts</p>

      <Alert message={error} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        {results.length === 0 && !userFilter && !categoryFilter ? (
          <div className="p-6">
            <EmptyState icon={BarChart3} title="No results yet" description="Results will appear once students take quizzes." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="py-3 px-5 font-medium">User</th>
                    <th className="py-3 px-5 font-medium">Quiz</th>
                    <th className="py-3 px-5 font-medium">Score</th>
                    <th className="py-3 px-5 font-medium">Percentage</th>
                    <th className="py-3 px-5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">
                        No results match your search.
                      </td>
                    </tr>
                  ) : (
                    results.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 px-5">
                          <div className="font-medium text-gray-800">{r.user_name}</div>
                          <div className="text-xs text-gray-400">{r.user_email}</div>
                        </td>
                        <td className="py-3 px-5 text-gray-600">{r.category_name}</td>
                        <td className="py-3 px-5 text-gray-600">{r.score}/{r.total}</td>
                        <td className="py-3 px-5 font-semibold text-primary-600">{r.percentage}%</td>
                        <td className="py-3 px-5 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleSearch} className="border-t border-gray-100 p-5 flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Search User</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Filter by Quiz</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                >
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={searching}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                <Search size={15} /> {searching ? 'Searching...' : 'Search'}
              </button>
              {(userFilter || categoryFilter) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
