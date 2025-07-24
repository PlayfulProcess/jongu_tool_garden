import { createClient } from '@supabase/supabase-js'
import { Tool, Submission, Rating } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database operations
export const db = {
  // Tools
  async getTools(filters?: {
    category?: string;
    search?: string;
    sort?: 'rating' | 'newest' | 'popular';
  }): Promise<Tool[]> {
    // Return empty array if Supabase is not configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL not configured, returning empty tools array')
      return []
    }

    let query = supabase
      .from('tools')
      .select('*')
      .eq('approved', true)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,creator_name.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tools:', error)
      return []
    }

    let tools = data || []

    // Client-side sorting
    if (filters?.sort === 'rating') {
      tools.sort((a, b) => b.avg_rating - a.avg_rating)
    } else if (filters?.sort === 'newest') {
      tools.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (filters?.sort === 'popular') {
      tools.sort((a, b) => b.total_ratings - a.total_ratings)
    }

    return tools
  },

  async getTool(id: string): Promise<Tool | null> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return null
    }

    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .eq('approved', true)
      .single()

    if (error) {
      console.error('Error fetching tool:', error)
      return null
    }

    return data
  },

  async submitTool(submission: Omit<Submission, 'id' | 'reviewed' | 'approved' | 'created_at'>): Promise<boolean> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase not configured, submission failed')
      return false
    }

    const { error } = await supabase
      .from('submissions')
      .insert(submission)

    if (error) {
      console.error('Error submitting tool:', error)
      return false
    }

    return true
  },

  async rateTool(toolId: string, rating: number, reviewText?: string, userIp?: string): Promise<boolean> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return false
    }

    const { error } = await supabase
      .from('ratings')
      .upsert({
        tool_id: toolId,
        user_ip: userIp || 'anonymous',
        rating,
        review_text: reviewText
      })

    if (error) {
      console.error('Error rating tool:', error)
      return false
    }

    return true
  },

  async trackToolView(toolId: string): Promise<void> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return
    }

    await supabase
      .from('tools')
      .update({ view_count: supabase.rpc('increment') })
      .eq('id', toolId)
  },

  async trackToolClick(toolId: string): Promise<void> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return
    }

    await supabase
      .from('tools')
      .update({ click_count: supabase.rpc('increment') })
      .eq('id', toolId)
  },

  // Admin functions (using service role)
  async getPendingSubmissions(): Promise<Submission[]> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return []
    }

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('reviewed', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching submissions:', error)
      return []
    }

    return data || []
  },

  async approveSubmission(submissionId: string): Promise<boolean> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return false
    }

    // Get the submission using admin client
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) {
      console.error('Error fetching submission:', fetchError)
      return false
    }

    // Insert into tools table using admin client
    const { error: insertError } = await supabaseAdmin
      .from('tools')
      .insert({
        title: submission.title,
        claude_url: submission.claude_url,
        category: submission.category,
        description: submission.description,
        creator_name: submission.creator_name,
        creator_link: submission.creator_link,
        creator_background: submission.creator_background,
        thumbnail_url: submission.thumbnail_url,
        approved: true
      })

    if (insertError) {
      console.error('Error inserting tool:', insertError)
      return false
    }

    // Mark submission as reviewed and approved using admin client
    const { error: updateError } = await supabaseAdmin
      .from('submissions')
      .update({ reviewed: true, approved: true })
      .eq('id', submissionId)

    if (updateError) {
      console.error('Error updating submission:', updateError)
      return false
    }

    return true
  },

  async rejectSubmission(submissionId: string): Promise<boolean> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return false
    }

    const { error } = await supabaseAdmin
      .from('submissions')
      .update({ reviewed: true, approved: false })
      .eq('id', submissionId)

    if (error) {
      console.error('Error rejecting submission:', error)
      return false
    }

    return true
  }
} 