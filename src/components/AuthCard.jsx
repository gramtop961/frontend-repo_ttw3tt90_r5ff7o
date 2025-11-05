import { useState } from 'react'
import { User } from 'lucide-react'

export default function AuthCard({ user, onSignIn, onSignOut }) {
  const [name, setName] = useState('')

  if (user) {
    return (
      <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-5 w-5 text-indigo-700"/>
          </div>
          <div>
            <div className="text-sm text-gray-500">Welcome back</div>
            <div className="font-semibold">{user}</div>
          </div>
        </div>
        <button onClick={onSignOut} className="text-sm font-medium px-3 py-2 rounded-md border hover:bg-gray-50">Sign out</button>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="text-sm text-gray-600 mb-2">Sign in to save your collection and battle</div>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a nickname"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => name.trim() && onSignIn(name.trim())}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Sign in
        </button>
      </div>
    </div>
  )
}
