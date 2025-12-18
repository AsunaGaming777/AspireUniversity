import React from 'react'

interface AccessDeniedProps {
  message?: string
}

export function AccessDenied({ message }: AccessDeniedProps) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
      <p className="text-gray-600">
        {message || "You don't have permission to access this page."}
      </p>
    </div>
  )
}

