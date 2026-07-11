'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold neon-text mb-8">Saving Wedding App</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-6xl">
        <Link href="/savings" className="glass glass-hover rounded-xl p-6 text-center transition-transform">

          <div className="text-5xl mb-4">💍</div>
          <h3 className="text-xl font-semibold text-white">Marriage Savings</h3>
        </Link>
        <Link href="/subscriptions" className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🧾</div>
          <h3 className="text-xl font-semibold text-white">Subscriptions</h3>
        </Link>
        <Link href="/debt" className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">📉</div>
          <h3 className="text-xl font-semibold text-white">Debt Management</h3>
        </Link>
        <Link href="/ai-advisor" className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white">AI Advisor</h3>
        </Link>
        <Link href="/income-expenses" className="glass rounded-xl p-6 text-center hover:scale-105 transition-transform">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-white">Income & Expenses</h3>
        </Link>
      </div>
    </div>
  )
}