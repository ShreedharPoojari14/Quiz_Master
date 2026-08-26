import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Brain } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Alert from '../components/Alert.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter both email and password.')
      return
    }
    setSubmitting(true)
    const result = await login(form.email.trim(), form.password)
    setSubmitting(false)
    if (result.success) {
      navigate(from || (result.user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-primary-50/60 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 mb-1">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white">
              <Brain size={20} />
            </span>
            QuizMaster
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back!</h1>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">Login to your account</p>

          <Alert message={error} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right mb-5">
              <span className="text-xs text-primary-600 font-medium cursor-default">Forgot Password?</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>

        <div className="mt-5 text-center text-xs text-gray-400">
          Demo accounts: admin@quizmaster.com / admin123 · john@quizmaster.com / student123
        </div>
      </div>
    </div>
  )
}
