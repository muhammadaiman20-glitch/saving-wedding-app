import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saving Wedding App',
  description: 'Track marriage savings, subscriptions, and debt.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neon-black text-slate-100">
        {children}
      </body>
    </html>
  )
}