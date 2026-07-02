'use client'

import type { FormEvent, ReactNode } from 'react'
import MarriageSavingTracker from '@/components/MarriageSavingTracker'
import SubscriptionManager from '@/components/SubscriptionManager'
import DebtManager from '@/components/DebtManager'
import AIAgentAdvisor from '@/components/AIAgentAdvisor'

type TabKey = 'savings' | 'subscriptions' | 'debt' | 'ai'

const tabs: { key: TabKey; label: string; description: string; icon: ReactNode }[] = [
  {
    key: 'savings',
    label: 'Marriage Savings',
    description: 'Goal, contributions, and milestone progress',
    icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-neon-blue">
        💍
      </span>
    ),
  },
  {
    key: 'subscriptions',
    label: 'Subscriptions',
    description: 'Recurring payments, renewals, and reminders',
    icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-neon-blue">
        🧾
      </span>
    ),
  },
  {
    key: 'debt',
    label: 'Debt Management',
    description: 'Balances, EMI-like schedules, and payoff tracking',
    icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-neon-blue">
        📉
      </span>
    ),
  },
  {
    key: 'ai',
    label: 'AI Advisor',
    description: 'Get suggestions and help from an AI assistant',
    icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-neon-blue">
        🤖
      </span>
    ),
  },
]

function classNames(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(' ')
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Saving Wedding App</h1>
        <p className="mt-2 text-slate-300/80">
          Manage marriage savings, subscriptions, debt, and get AI-powered financial guidance.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className="glass glass-hover rounded-2xl p-5 transition-transform duration-150 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">{tab.label}</p>
                <p className="mt-1 text-xs text-slate-300/80">{tab.description}</p>
              </div>
              {tab.icon}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MarriageSavingTracker />
        <SubscriptionManager />
      </section>
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DebtManager />
        <AIAgentAdvisor />
      </section>
    </main>
  )
}