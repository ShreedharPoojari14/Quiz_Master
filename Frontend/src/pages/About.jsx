import React from 'react'
import { Laptop, HelpCircle } from 'lucide-react'

const stats = [
  { value: '120+', label: 'Questions' },
  { value: '45+', label: 'Users' },
  { value: '6+', label: 'Categories' },
]

export default function About() {
  return (
    <div className="container-page py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            QuizMaster is a gamified Online Quiz Management System designed to help students test their
            knowledge, improve their skills, and track their performance.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our platform provides a wide range of quizzes across different categories with instant results,
            points, levels, and a leaderboard — so learning feels like a game, not a chore.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-64 rounded-3xl bg-primary-50 flex items-center justify-center relative">
            <Laptop size={110} className="text-primary-500" strokeWidth={1.2} />
            <span className="absolute top-4 right-6 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center">
              <HelpCircle size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
        {stats.map((s) => (
          <div key={s.label} className="text-center bg-white rounded-2xl border border-gray-100 shadow-card py-8">
            <div className="text-2xl md:text-3xl font-extrabold text-primary-600">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
