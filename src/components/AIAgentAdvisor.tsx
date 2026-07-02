'use client'

import { useEffect, useState, type FormEvent } from 'react'

type Message = {
  role: 'user' | 'assistant'
  text: string
  time: string
}

const suggestions = [
  'Suggest a priority order to clear my debt.',
  'How much should I save monthly for the wedding?',
  'Should I pause any subscriptions this month?',
]

const getFormattedTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function AIAgentAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hi! I can help you plan savings, review subscriptions, and suggest a debt payoff strategy.',
      time: '--:--',
    },
  ])
  const [input, setInput] = useState('')

  useEffect(() => {
    setMessages((prev) =>
      prev.map((message, index) => (index === 0 ? { ...message, time: getFormattedTime() } : message)),
    )
  }, [])

  const send = (text: string) => {
    if (!text.trim()) return
    const now = getFormattedTime()
    setMessages((prev) => [
      ...prev,
      { role: 'user', text, time: now },
      {
        role: 'assistant',
        text: `Simulated advice for: "${text}" — this would be connected to an AI provider in the final version.`,
        time: now,
      },
    ])
    setInput('')
  }

  return (
    <div className="glass glass-hover flex h-[480px] flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">AI Advisor</h2>
          <p className="text-xs text-slate-300/80">Ask for savings, subscription, or debt advice</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neon-blue">
          Alpha
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3">
        {messages.map((m, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className={`text-[11px] font-semibold ${m.role === 'assistant' ? 'text-neon-blue' : 'text-slate-300/90'}`}>
              {m.role === 'assistant' ? 'Assistant' : 'You'} • {m.time}
            </span>
            <p className="text-sm text-white/90">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:border-neon-blue/50 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>

      <form className="mt-3 flex gap-2" onSubmit={(e: FormEvent) => {
        e.preventDefault()
        send(input)
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about finances, savings, or debt..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-300/60 outline-none focus:border-neon-blue/60"
        />
        <button
          type="submit"
          className="rounded-lg border border-neon-blue/40 bg-neon-blue/10 px-3 py-2 text-xs font-semibold text-neon-blue hover:border-neon-blue/70 hover:bg-neon-blue/20"
        >
          Send
        </button>
      </form>
    </div>
  )
}