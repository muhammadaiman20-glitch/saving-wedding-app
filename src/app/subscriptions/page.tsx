'use client'

import SubscriptionManager from '@/components/SubscriptionManager'
import ReceiptScanner from '@/components/ReceiptScanner'

export default function SubscriptionsPage() {
  const handleAmountExtracted = (amount: number) => {
    console.log(`Amount extracted: ${amount} added to savings`);
  }

  return (
    <main className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg">🧾</span>
            <span className="text-sm text-[#00c8ff]">Manage recurring expenses</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="neon-text">Subscription Manager</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Track and optimize your recurring expenses. Scan receipts to automatically track spending and save more for your wedding.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <SubscriptionManager />
          </div>
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <ReceiptScanner onAmountExtracted={handleAmountExtracted} />
          </div>
        </div>
      </div>
    </main>
  )
}