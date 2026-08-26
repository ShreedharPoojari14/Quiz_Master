import React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Alert({ type = 'error', message }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div
      className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm mb-4 border ${
        isError
          ? 'bg-red-50 text-red-700 border-red-100'
          : 'bg-green-50 text-green-700 border-green-100'
      }`}
      role="alert"
    >
      {isError ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
      <span>{message}</span>
    </div>
  )
}
