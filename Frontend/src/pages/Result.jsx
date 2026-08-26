import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Trophy, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const attempt = location.state?.attempt
  const [showAnswers, setShowAnswers] = useState(false)

  if (!attempt) {
    return (
      <div className="container-page py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No result to show</h2>
        <p className="text-gray-500 mb-6">Take a quiz first to see your results here.</p>
        <Link
          to="/categories"
          className="inline-block px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm"
        >
          Browse Categories
        </Link>
      </div>
    )
  }

  const percentage = attempt.percentage
  const ringColor = percentage >= 70 ? '#16a34a' : percentage >= 40 ? '#d97706' : '#dc2626'

  return (
    <div className="min-h-[85vh] bg-gray-50 py-14">
      <div className="container-page max-w-xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center relative overflow-hidden">
          <div className="flex justify-center mb-3">
            <span className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
              <Trophy size={32} className="text-yellow-500" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Completed!</h1>
          <p className="text-gray-500 mb-6">Congratulations, {attempt.category_name}</p>

          <div className="flex justify-center mb-6">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${ringColor} ${percentage * 3.6}deg, #f1f5f9 0deg)`,
              }}
            >
              <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">
                  {attempt.score}
                  <span className="text-sm text-gray-400">/{attempt.total}</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">Your Score</p>
          <p className="text-2xl font-bold mb-6" style={{ color: ringColor }}>
            {percentage}%
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-green-50 rounded-xl py-4">
              <div className="text-lg font-bold text-green-600">{attempt.correct_count}</div>
              <div className="text-xs text-gray-500">Correct Answers</div>
            </div>
            <div className="bg-red-50 rounded-xl py-4">
              <div className="text-lg font-bold text-red-600">{attempt.wrong_count}</div>
              <div className="text-xs text-gray-500">Wrong Answers</div>
            </div>
            <div className="bg-gray-100 rounded-xl py-4">
              <div className="text-lg font-bold text-gray-600">{attempt.skipped_count}</div>
              <div className="text-xs text-gray-500">Skipped</div>
            </div>
          </div>

          <p className="text-sm text-primary-600 font-medium mb-6">
            +{attempt.points_earned ?? attempt.points_earned} points earned 🎉
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setShowAnswers((s) => !s)}
              className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              {showAnswers ? 'Hide Answers' : 'View Answers'}
            </button>
            <button
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Try Another Quiz
            </button>
          </div>
        </div>

        {showAnswers && (
          <div className="mt-6 space-y-4 animate-fade-in">
            {attempt.answers.map((a, idx) => (
              <div key={a.question_id} className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
                <div className="flex items-start gap-2 mb-3">
                  {a.selected_option == null ? (
                    <MinusCircle size={18} className="text-gray-400 mt-0.5 shrink-0" />
                  ) : a.is_correct ? (
                    <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                  )}
                  <p className="font-medium text-gray-800 text-sm">
                    {idx + 1}. {a.question}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 pl-6">
                  {a.options.map((opt, i) => {
                    const optNum = i + 1
                    const isCorrect = optNum === a.correct_option
                    const isSelected = optNum === a.selected_option
                    return (
                      <div
                        key={i}
                        className={`text-xs px-3 py-2 rounded-lg border ${
                          isCorrect
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : isSelected
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-gray-200 text-gray-500'
                        }`}
                      >
                        {opt}
                        {isCorrect && ' ✓'}
                        {isSelected && !isCorrect && ' (your answer)'}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
