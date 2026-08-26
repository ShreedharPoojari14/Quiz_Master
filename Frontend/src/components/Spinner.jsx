import React from 'react'

export default function Spinner({ full = false, label = 'Loading...' }) {
  return (
    <div
      className={
        full
          ? 'min-h-[60vh] flex flex-col items-center justify-center gap-3'
          : 'flex flex-col items-center justify-center gap-3 py-10'
      }
    >
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
