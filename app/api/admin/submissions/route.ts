import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Simple password check for admin access
    const password = request.headers.get('x-admin-password')
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pendingSubmissions = await db.getPendingSubmissions()
    
    return NextResponse.json({
      submissions: pendingSubmissions,
      count: pendingSubmissions.length
    })
  } catch (error) {
    console.error('Error fetching pending submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}