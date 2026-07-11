'use client'

import { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'

interface ScannedReceipt {
  amount: number | null
  date: string | null
  description: string | null
  rawText: string
}

export default function ReceiptScanner({ onAmountExtracted }: { onAmountExtracted: (amount: number) => void }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedReceipt, setScannedReceipt] = useState<ScannedReceipt | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractAmountFromText = (text: string): number | null => {
    // Common currency patterns including RM (Malaysian Ringgit)
    const amountPatterns = [
      /RM\s*(\d+,?\d+\.?\d{0,2})/gi,
      /MYR\s*(\d+,?\d+\.?\d{0,2})/gi,
      /Total\s*[:]?\s*(\d+,?\d+\.?\d{0,2})/gi,
      /Amount\s*[:]?\s*(\d+,?\d+\.?\d{0,2})/gi,
      /Sum\s*[:]?\s*(\d+,?\d+\.?\d{0,2})/gi,
      /(\d+,?\d+\.?\d{0,2})\s*RM/gi
    ]

    let largestAmount = 0
    for (const pattern of amountPatterns) {
      const matches = [...text.matchAll(pattern)]
      for (const match of matches) {
        const numStr = match[1].replace(/,/g, '')
        const num = parseFloat(numStr)
        if (!isNaN(num) && num > largestAmount) {
          largestAmount = num
        }
      }
    }

    return largestAmount > 0 ? largestAmount : null
  }

  const extractDateFromText = (text: string): string | null => {
    const datePatterns = [
      /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/,
      /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/
    ]

    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) return match[0]
    }
    return null
  }

  const scanReceipt = async (file: File) => {
    setIsScanning(true)
    setScanProgress(0)
    setScannedReceipt(null)

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100))
          }
        }
      })

      const text = result.data.text
      const amount = extractAmountFromText(text)
      const date = extractDateFromText(text)

      setScannedReceipt({
        amount,
        date,
        description: amount ? `Scanned receipt - RM${amount.toFixed(2)}` : 'Receipt scanned, amount not detected',
        rawText: text
      })
    } catch (error) {
      console.error('OCR Error:', error)
      setScannedReceipt({
        amount: null,
        date: null,
        description: 'Error scanning receipt',
        rawText: ''
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      scanReceipt(file)
    }
  }

  const handleAddToSavings = async () => {
    if (scannedReceipt?.amount) {
      // Save receipt to backend
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/receipts/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scannedReceipt)
        })
      } catch (error) {
        console.error('Failed to save receipt to backend:', error)
      }
      
      // Add amount to savings
      onAmountExtracted(scannedReceipt.amount)
      setScannedReceipt(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="glass glass-hover rounded-2xl p-6 bg-gradient-to-br from-[#00c8ff]/10 to-[#00e5ff]/5 border-[#00c8ff]/40 relative overflow-hidden group" style={{ boxShadow: '0 0 30px rgba(0, 200, 255, 0.2), inset 0 0 0 1px rgba(0, 200, 255, 0.1)' }}>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="mb-6 flex items-center gap-2 relative z-10">
        <span className="text-2xl">🧾</span>
        <h2 className="text-xl font-semibold neon-text">Receipt Scanner</h2>
      </div>

      <div 
        className="border-2 border-dashed border-[#00c8ff]/40 rounded-xl p-8 text-center transition-all duration-500 cursor-pointer relative overflow-hidden group/upload hover:border-[#00c8ff]/80 hover:bg-[#00c8ff]/10"
        onClick={() => fileInputRef.current?.click()}
        style={{ boxShadow: '0 0 20px rgba(0, 200, 255, 0.1), inset 0 0 30px rgba(0, 200, 255, 0.05)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 200, 255, 0.3), inset 0 0 50px rgba(0, 200, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 200, 255, 0.1), inset 0 0 30px rgba(0, 200, 255, 0.05)';
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/upload:translate-x-full transition-transform duration-1000 pointer-events-none" />
        <span className="text-4xl block mb-3 transform group-hover/upload:scale-110 transition-transform duration-300">📷</span>
        <p className="text-slate-300 group-hover/upload:text-[#00c8ff] transition-colors duration-300">Click to upload a receipt image or take a photo</p>
        <p className="text-slate-400 text-sm mt-1 group-hover/upload:text-slate-300 transition-colors duration-300">OCR will automatically extract the amount</p>
      </div>

      {isScanning && (
        <div className="mt-4 p-4 bg-[#00c8ff]/10 rounded-xl border border-[#00c8ff]/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00c8ff]/5 to-transparent animate-pulse pointer-events-none" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-[#00c8ff] neon-text">Scanning receipt...</span>
            <span className="text-[#00c8ff] neon-text">{scanProgress}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#00c8ff] to-[#00e5ff] transition-all duration-300 relative"
              style={{ width: `${scanProgress}%`, boxShadow: '0 0 15px rgba(0, 200, 255, 0.8)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {scannedReceipt && (
        <div className="mt-4 p-4 bg-[#00c8ff]/15 rounded-xl border border-[#00c8ff]/40 relative overflow-hidden" style={{ boxShadow: '0 0 25px rgba(0, 200, 255, 0.15)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          <h3 className="text-white font-semibold mb-3 relative z-10 neon-text">📋 Scanned Results</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-[#00c8ff]/20 hover:border-[#00c8ff]/50 transition-all duration-300 hover:scale-105">
              <p className="text-slate-400 text-xs">Detected Amount</p>
              <p className="text-[#00ff88] font-bold text-lg" style={{ textShadow: '0 0 12px rgba(0, 255, 136, 0.6)' }}>
                {scannedReceipt.amount ? `RM${scannedReceipt.amount.toFixed(2)}` : 'Not detected'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-[#00c8ff]/20 hover:border-[#00c8ff]/50 transition-all duration-300 hover:scale-105">
              <p className="text-slate-400 text-xs">Detected Date</p>
              <p className="text-[#00c8ff] font-semibold" style={{ textShadow: '0 0 8px rgba(0, 200, 255, 0.5)' }}>
                {scannedReceipt.date || 'Not detected'}
              </p>
            </div>
          </div>

          {scannedReceipt.amount && (
            <button
              onClick={handleAddToSavings}
              className="w-full py-3 rounded-xl border border-[#00ff88]/50 bg-gradient-to-r from-[#00ff88]/20 to-[#00c8ff]/20 text-[#00ff88] font-semibold relative overflow-hidden transition-all duration-300 hover:scale-105 hover:from-[#00ff88]/30 hover:to-[#00c8ff]/30 group/btn"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 200, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
              <span className="relative z-10">✨ Add RM{scannedReceipt.amount.toFixed(2)} to Savings</span>
            </button>
          )}

          <details className="mt-3 relative z-10">
            <summary className="text-slate-400 text-sm cursor-pointer hover:text-[#00c8ff] transition-colors duration-300">View raw scanned text</summary>
            <pre className="mt-2 p-3 bg-black/40 rounded-lg text-xs text-slate-400 overflow-x-auto max-h-32 overflow-y-auto border border-[#00c8ff]/20">
              {scannedReceipt.rawText || 'No text extracted'}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}