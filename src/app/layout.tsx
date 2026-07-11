import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Saving Wedding App',
  description: 'Track marriage savings, subscriptions, and debt.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-100">


        <Navigation />
        {children}
      </body>
    </html>
  )
}