import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'RevEng | Revenue Engineering Blog',
  description: 'Expert insights on revenue recovery, Stripe optimization, dunning management, Klaviyo & GHL integrations. Bridging the gap between marketing, sales, and payment data.',
  keywords: ['revenue recovery', 'stripe', 'dunning', 'involuntary churn', 'klaviyo', 'gohighlevel', 'revenue engineering', 'payment optimization'],
}

export const viewport = {
  themeColor: '#0a2540',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
