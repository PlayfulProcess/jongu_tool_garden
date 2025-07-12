import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') as 'rating' | 'newest' | 'popular' | null

    const tools = await db.getTools({
      category: category || undefined,
      search: search || undefined,
      sort: sort || 'rating'
    })

    return NextResponse.json({ tools })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
} 