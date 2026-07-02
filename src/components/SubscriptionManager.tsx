'use client'

import type { FormEvent, ReactNode } from 'react'

const subscriptions = [
  { id: 1, name: 'Streaming', amount: 49.9, cycle: 'Monthly', nextBill: '2026-07-15', active: true },
  { id: 2, name: 'Gym', amount: 120, cycle: 'Monthly', nextBill: '2026-07-10', active: true },
  { id: 3, name: 'Cloud Backup', amount: 29, cycle: 'Monthly', nextBill: '2026-07-08', active: true },
  { id: 4, name: 'Music', amount: 19.9, cycle: 'Monthly', nextBill: '2026-07-12', active: true },
  { id: 5, name: 'Software Suite', amount: 199, cycle: 'Yearly', nextBill: '2027-01-01', active: false },
]

export default function SubscriptionManager() {
  const totalMonthly = subscriptions.reduce((sum, s) => sum + (s.cycle === 'Monthly' ? s.amount : 0), 0)
  const totalYearly = subscriptions.reduce((sum, s) => sum + (s.cycle === 'Yearly' ? s.amount : 0), 0)

  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Subscriptions</h2>
          <p className="text-xs text-slate-300/80">Recurring payments and renewal dates</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neon-blue">
          {subscriptions.length} active
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Monthly outflow</p>
          <p className="mt-1 text-sm font-semibold text-white">RM {totalMonthly.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Yearly outflow</p>
          <p className="mt-1 text-sm font-semibold text-white">RM {totalYearly.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {subscriptions.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-white">{s.name}</p>
              <p className="text-xs text-slate-300/80">Next: {s.nextBill} • {s.cycle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">RM {s.amount.toFixed(2)}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  s.active ? 'border-emerald-400/40 text-emerald-300' : 'border-white/20 text-slate-300/80'
                }`}
              >
                {s.active ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}