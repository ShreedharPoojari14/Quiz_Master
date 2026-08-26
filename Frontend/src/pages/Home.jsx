import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, Zap, TrendingUp, Smile, Trophy, GraduationCap, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const features = [
  {
    icon: Layers,
    title: 'Many Categories',
    description: 'Choose from a variety of topics and subjects to test yourself on.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your score instantly after completing your quiz.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Track your performance and improve over time with detailed stats.',
  },
  {
    icon: Smile,
    title: 'User Friendly',
    description: 'Simple and easy to use interface for a smooth experience.',
  },
]

export default function Home() {
  const { user } = useAuth()
  const primaryCta = user ? '/categories' : '/register'

  return (
    <div>
      <section className="relative overflow-hidden bg-[#0d0630]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(111,61,251,0.35),_transparent_55%)]" />
        <div className="container-page relative py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Test Your Knowledge
              <br />
              Win Your Future
            </h1>
            <p className="text-gray-300 mt-5 text-base md:text-lg max-w-md">
              Welcome to QuizMaster, the gamified Online Quiz Management System. Choose a category, start a
              quiz, and earn points as you learn.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={primaryCta}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  I have an account
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative w-72 h-72 rounded-3xl bg-gradient-to-br from-primary-500/30 to-primary-700/10 flex items-center justify-center border border-white/10">
              <GraduationCap size={140} className="text-primary-300" strokeWidth={1.2} />
              <Trophy size={54} className="absolute -bottom-4 -right-4 text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">Why QuizMaster?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600">
        <div className="container-page text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to test yourself?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">
            Join QuizMaster today, pick a category, and start earning points toward your next badge.
          </p>
          <Link
            to={primaryCta}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            {user ? 'Browse Categories' : 'Create Free Account'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
