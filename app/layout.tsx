import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jongu Tool Garden - Community Emotional Wellness Tools',
  description: 'Practical tools created by therapists, parents, and wellness enthusiasts. Try them, rate them, share what works.',
  keywords: 'emotional wellness, mental health tools, therapy, mindfulness, community',
  authors: [{ name: 'Jongu Tool Garden' }],
  openGraph: {
    title: 'Jongu Tool Garden - Community Emotional Wellness Tools',
    description: 'Practical tools created by therapists, parents, and wellness enthusiasts.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jongu Tool Garden - Community Emotional Wellness Tools',
    description: 'Practical tools created by therapists, parents, and wellness enthusiasts.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 