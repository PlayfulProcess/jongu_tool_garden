'use client'

import { useState, useEffect } from 'react'
import { Submission } from '@/lib/types'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Attempting login...')
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        console.log('Login successful, loading submissions...')
        setAdminPassword(password) // Store for API calls
        setIsAuthenticated(true)
        loadSubmissions()
      } else {
        const error = await response.json()
        console.log('Login failed')
        alert(error.error || 'Incorrect password')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    }
  }

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      console.log('Loading submissions...')
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'x-admin-password': adminPassword
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Loaded submissions:', data.count, data.submissions)
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Error loading submissions:', error)
      alert('Failed to load submissions: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        },
        body: JSON.stringify({ submissionId })
      })
      
      if (response.ok) {
        alert('Tool approved!')
        loadSubmissions()
      } else {
        const error = await response.json()
        alert('Failed to approve tool: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      alert('Error approving tool: ' + error)
    }
  }

  const handleReject = async (submissionId: string) => {
    try {
      const response = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        },
        body: JSON.stringify({ submissionId })
      })
      
      if (response.ok) {
        alert('Tool rejected')
        loadSubmissions()
      } else {
        const error = await response.json()
        alert('Failed to reject tool: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      alert('Error rejecting tool: ' + error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Enter password to access admin panel
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Panel - Pending Submissions
          </h1>
          <button
            onClick={loadSubmissions}
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No pending submissions
            </h3>
            <p className="text-gray-600">
              All submissions have been reviewed
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {submission.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {submission.description}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p><strong>Creator:</strong> {submission.creator_name}</p>
                      {submission.creator_background && (
                        <p><strong>Background:</strong> {submission.creator_background}</p>
                      )}
                      <p><strong>Category:</strong> {submission.category}</p>
                      <p><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleDateString()}</p>
                      {submission.creator_link && (
                        <p><strong>Link:</strong> <a href={submission.creator_link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{submission.creator_link}</a></p>
                      )}
                      <p><strong>Claude URL:</strong> <a href={submission.claude_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">View Tool</a></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(submission.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(submission.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 