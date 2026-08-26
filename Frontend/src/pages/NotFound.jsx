import React from 'react'
import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-5">
        <CompassIcon size={30} />
      </span>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
