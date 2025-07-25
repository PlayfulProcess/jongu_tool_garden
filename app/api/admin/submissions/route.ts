import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Simple password check for admin access
    const password = request.headers.get('x-admin-password')
    const expectedPassword = process.env.ADMIN_PASSWORD
    
    console.log('Admin submissions request:')
    console.log('- Password provided:', password ? 'Yes' : 'No')
    console.log('- Expected password set:', expectedPassword ? 'Yes' : 'No')
    console.log('- Passwords match:', password === expectedPassword)
    
    if (!expectedPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      )
    }
    
    if (password !== expectedPassword) {
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