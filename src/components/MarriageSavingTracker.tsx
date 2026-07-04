'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

const defaultGoal = { name: 'Our Dream Wedding 💕', target: 50000, current: 18200, currency: 'RM' }

export default function MarriageSavingTracker({ goal = defaultGoal }: { goal?: typeof defaultGoal }) {
  const remaining = Math.max(goal.target - goal.current, 0)
  const pct = Math.min(Math.max((goal.current / goal.target) * 100, 0), 100)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const handleTransfer = async () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/savings/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount, note: 'Transfer to wedding account' })
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        setAmount('')
      }
    } catch (error) {
      setMessage('Transfer failed')
    }
  }

  return (
    <div className="glass glass-hover rounded-2xl p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/30">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💍</span>
            <h2 className="text-xl font-semibold text-white">Wedding Savings</h2>
          </div>
          <p className="text-sm text-slate-300/80 ml-10">{goal.name}</p>
        </div>
        <span className="rounded-full border border-pink-400/40 bg-pink-500/20 px-4 py-2 text-sm text-pink-300 shadow-lg shadow-pink-500/20">
          {pct.toFixed(1)}% Complete
        </span>
      </div>

      {/* Romantic progress bar with hearts */}
      <div className="mb-2">
        <div className="relative h-4 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 shadow-lg shadow-pink-500/40 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          >
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">💕</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-400 mb-6">
        <span>Engagement 💑</span>
        <span>The Big Day 💒</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-pink-400/20 bg-pink-500/10 p-4 hover:scale-105 transition-transform">
          <span className="text-2xl block mb-2">🎯</span>
          <p className="text-slate-300/80 text-sm">Target</p>
          <p className="mt-1 text-lg font-bold text-white">{goal.currency} {goal.target.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 hover:scale-105 transition-transform">
          <span className="text-2xl block mb-2">✨</span>
          <p className="text-slate-300/80 text-sm">Saved</p>
          <p className="mt-1 text-lg font-bold text-emerald-300">{goal.currency} {goal.current.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 hover:scale-105 transition-transform">
          <span className="text-2xl block mb-2">⏳</span>
          <p className="text-slate-300/80 text-sm">Remaining</p>
          <p className="mt-1 text-lg font-bold text-amber-300">{goal.currency} {remaining.toLocaleString()}</p>
        </div>
      </div>

      <form className="mt-6 flex gap-3" onSubmit={(e: FormEvent) => e.preventDefault()}>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter amount to transfer..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300/60 outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all"
        />
        <button
          type="button"
          onClick={handleTransfer}
          className="rounded-xl border border-pink-400/40 bg-pink-500/20 px-5 py-3 text-sm font-semibold text-pink-300 hover:border-pink-400/70 hover:bg-pink-500/30 hover:scale-105 transition-all shadow-lg shadow-pink-500/20"
        >
          Transfer 💕
        </button>
      </form>
      {message && <p className="mt-2 text-center text-sm text-emerald-300">{message}</p>}

      {/* Milestone celebration */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-pink-500/15 to-rose-500/15 border border-pink-400/30">
        <p className="text-center text-pink-200 text-sm">
          🎉 You're {pct >= 50 ? 'over halfway!' : pct >= 30 ? 'making great progress!' : 'just getting started!'} 
          Keep saving for your special day! 💖
        </p>
      </div>
    </div>
  )
}