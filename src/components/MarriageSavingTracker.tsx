'use client'

import type { FormEvent, ReactNode } from 'react'

const defaultGoal = { name: 'Wedding Fund', target: 50000, current: 18200, currency: 'RM' }

export default function MarriageSavingTracker({ goal = defaultGoal }: { goal?: typeof defaultGoal }) {
  const remaining = Math.max(goal.target - goal.current, 0)
  const pct = Math.min(Math.max((goal.current / goal.target) * 100, 0), 100)

  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Marriage Savings</h2>
          <p className="text-xs text-slate-300/80">{goal.name}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neon-blue">
          {pct.toFixed(1)}%
        </span>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-white/5">
        <div
          className="h-2 rounded-full bg-neon-blue shadow-neon"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Target</p>
          <p className="mt-1 text-sm font-semibold text-white">{goal.currency} {goal.target.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Saved</p>
          <p className="mt-1 text-sm font-semibold text-white">{goal.currency} {goal.current.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Remaining</p>
          <p className="mt-1 text-sm font-semibold text-white">{goal.currency} {remaining.toLocaleString()}</p>
        </div>
      </div>

      <form className="mt-4 flex gap-2" onSubmit={(e: FormEvent) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Add contribution note"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-300/60 outline-none focus:border-neon-blue/60"
        />
        <button
          type="button"
          className="rounded-lg border border-neon-blue/40 bg-neon-blue/10 px-3 py-2 text-xs font-semibold text-neon-blue hover:border-neon-blue/70 hover:bg-neon-blue/20"
        >
          Add
        </button>
      </form>
    </div>
  )
}