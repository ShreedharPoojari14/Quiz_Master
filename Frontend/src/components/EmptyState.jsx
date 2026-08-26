import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
          <Icon size={26} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
