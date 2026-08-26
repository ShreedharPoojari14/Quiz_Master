import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import api, { getErrorMessage } from '../api/axios.js'
import Spinner from '../components/Spinner.jsx'
import Alert from '../components/Alert.jsx'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

export default function Quiz() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const storageKey = `quizmaster_progress_${categoryId}`

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const submittedRef = useRef(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const saved = sessionStorage.getItem(storageKey)
        if (saved) {
          const parsed = JSON.parse(saved)
          setCategory(parsed.category)
          setQuestions(parsed.questions)
          setAnswers(parsed.answers || {})
          setCurrent(parsed.current || 0)
          setTimeLeft(parsed.timeLeft ?? parsed.duration_seconds)
        } else {
          const { data } = await api.get(`/quiz/${categoryId}`)
          setCategory(data.category)
          setQuestions(data.questions)
          setTimeLeft(data.duration_seconds)
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  // Persist progress
  useEffect(() => {
    if (!loading && questions.length > 0 && !submittedRef.current) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ category, questions, answers, current, timeLeft })
      )
    }
  }, [category, questions, answers, current, timeLeft, loading, storageKey])

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return
      submittedRef.current = true
      setSubmitting(true)
      try {
        const { data } = await api.post('/quiz/submit', {
          category_id: Number(categoryId),
          answers,
        })
        sessionStorage.removeItem(storageKey)
        navigate('/result', { state: { attempt: data.attempt }, replace: true })
      } catch (err) {
        setError(getErrorMessage(err) + (auto ? ' (time expired)' : ''))
        submittedRef.current = false
        setSubmitting(false)
      }
    },
    [answers, categoryId, navigate, storageKey]
  )

  // Timer
  useEffect(() => {
    if (loading || questions.length === 0 || submittedRef.current) return
    if (timeLeft <= 0) {
      handleSubmit(true)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, loading, questions.length, handleSubmit])

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const q = questions[current]
  const progressPct = questions.length ? ((current + 1) / questions.length) * 100 : 0

  function selectOption(optionIndex) {
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }))
  }

  if (loading) return <Spinner full label="Preparing your quiz..." />

  if (error && questions.length === 0) {
    return (
      <div className="container-page py-16 max-w-lg">
        <Alert message={error} />
        <Link to="/categories" className="text-primary-600 font-medium text-sm">
          &larr; Back to categories
        </Link>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="min-h-[85vh] bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-page py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900">{category?.name}</h1>
            <p className="text-xs text-gray-400">
              Question {current + 1} of {questions.length}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 font-semibold text-sm px-3 py-1.5 rounded-lg ${
              timeLeft <= 30 ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'
            }`}
          >
            <Clock size={16} /> Time Left: {formatTime(timeLeft)}
          </div>
        </div>
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="container-page py-10 max-w-2xl">
        {error && <Alert message={error} />}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-7">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{q.question}</h2>

          <div className="space-y-3">
            {[q.option1, q.option2, q.option3, q.option4].map((option, idx) => {
              const optionNumber = idx + 1
              const isSelected = answers[q.id] === optionNumber
              return (
                <button
                  key={idx}
                  onClick={() => selectOption(optionNumber)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary-600' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-primary-600" />}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm disabled:opacity-40 hover:bg-white transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span className="text-xs text-gray-400">{answeredCount} of {questions.length} answered</span>

          {current === questions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
