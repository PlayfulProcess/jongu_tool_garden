import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getClientIP } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rating } = await request.json()
    const toolId = params.id
    const clientIP = getClientIP(request)

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate tool ID
    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      )
    }

    const success = await db.rateTool(toolId, rating, undefined, clientIP)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Rating submitted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to submit rating' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting rating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}