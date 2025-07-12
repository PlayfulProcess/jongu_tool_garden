import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getClientIP, checkSubmissionLimit } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Check rate limiting
    if (!checkSubmissionLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Please wait 5 minutes between submissions' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      title,
      claude_url,
      category,
      description,
      creator_name,
      creator_link,
      creator_background,
      thumbnail_url
    } = body

    // Basic validation
    if (!title || !claude_url || !category || !description || !creator_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const success = await db.submitTool({
      title,
      claude_url,
      category,
      description,
      creator_name,
      creator_link,
      creator_background,
      thumbnail_url,
      submitter_ip: clientIP
    })

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Tool submitted for review'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to submit tool' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting tool:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 