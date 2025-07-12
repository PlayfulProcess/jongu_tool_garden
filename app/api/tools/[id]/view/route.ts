import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    const toolId = params.id

    if (action === 'view') {
      await db.trackToolView(toolId)
    } else if (action === 'click') {
      await db.trackToolClick(toolId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking tool view/click:', error)
    return NextResponse.json(
      { error: 'Failed to track action' },
      { status: 500 }
    )
  }
} 