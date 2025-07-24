import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getClientIP, checkSubmissionLimit, validateSubmission, sanitizeText } from '@/lib/utils'

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
    
    // Validate and sanitize input
    const validation = validateSubmission(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

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

    // Sanitize text inputs
    const sanitizedData = {
      title: sanitizeText(title),
      claude_url: claude_url.trim(),
      category,
      description: sanitizeText(description),
      creator_name: sanitizeText(creator_name),
      creator_link: creator_link?.trim(),
      creator_background: creator_background ? sanitizeText(creator_background) : undefined,
      thumbnail_url: thumbnail_url?.trim()
    }

    const success = await db.submitTool(sanitizedData)

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