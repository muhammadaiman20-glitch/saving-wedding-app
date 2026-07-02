'use client'

import type { FormEvent, ReactNode } from 'react'

const debts = [
  { id: 1, name: 'Personal Loan', balance: 12000, monthly: 850, interest: 8.4, dueDay: 5 },
  { id: 2, name: 'Credit Card', balance: 6500, monthly: 420, interest: 18.5, dueDay: 18 },
  { id: 3, name: 'Wedding Vendor', balance: 9800, monthly: 1200, interest: 0, dueDay: 1 },
]

export default function DebtManager() {
  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMonthly = debts.reduce((sum, d) => sum + d.monthly, 0)

  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Debt Management</h2>
          <p className="text-xs text-slate-300/80">Track balances, payments, and payoff progress</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neon-blue">
          {debts.length} items
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Total balance</p>
          <p className="mt-1 text-sm font-semibold text-white">RM {totalBalance.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-slate-300/80">Monthly payments</p>
          <p className="mt-1 text-sm font-semibold text-white">RM {totalMonthly.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {debts.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-white">{d.name}</p>
              <p className="text-xs text-slate-300/80">Due day {d.dueDay} • Interest {d.interest}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">RM {d.balance.toLocaleString()}</p>
              <p className="text-xs text-slate-300/80">RM {d.monthly.toLocaleString()}/mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}