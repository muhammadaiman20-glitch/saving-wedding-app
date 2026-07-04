'use client'

import MarriageSavingTracker from '@/components/MarriageSavingTracker'

export default function SavingsPage() {
  return (
    <main className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg">💍</span>
            <span className="text-sm text-[#00c8ff]">Track your dream wedding fund</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="neon-text">Marriage Savings Tracker</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Watch your wedding savings grow with every contribution. Stay on track to achieve your dream wedding budget.
          </p>
        </div>
        
        <div className="transform transition-all duration-500 hover:scale-[1.01]">
          <MarriageSavingTracker />
        </div>
      </div>
    </main>
  )
}