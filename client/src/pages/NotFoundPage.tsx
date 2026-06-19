import React from 'react'

function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
        <a href="/" className="text-blue-500 hover:underline">Go back to Home</a>
    </div>
  )
}

export default NotFoundPage
