import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Simple password check for admin access
    const password = request.headers.get('x-admin-password')
    
    if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { submissionId } = await request.json()
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      )
    }

    const success = await db.approveSubmission(submissionId)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to approve submission' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error approving submission:', error)
    return NextResponse.json(
      { error: 'Failed to approve submission' },
      { status: 500 }
    )
  }
}