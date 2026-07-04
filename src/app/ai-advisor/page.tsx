'use client'

import AIAgentAdvisor from '@/components/AIAgentAdvisor'

export default function AIAdvisorPage() {
  return (
    <main className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg">🤖</span>
            <span className="text-sm text-[#00c8ff]">Smart financial guidance</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="neon-text">AI Financial Advisor</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get personalized financial advice powered by AI. Make smarter decisions to maximize your wedding savings and achieve your goals faster.
          </p>
        </div>
        
        <div className="transform transition-all duration-500 hover:scale-[1.01]">
          <AIAgentAdvisor />
        </div>
      </div>
    </main>
  )
}