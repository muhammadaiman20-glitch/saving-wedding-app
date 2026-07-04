'use client'

import { useState } from 'react'

const defaultSettings = {
  husbandPin: '0000',
  wifePin: '1111'
}

export default function Settings() {
  const [selectedUser, setSelectedUser] = useState<'husband' | 'wife'>('husband')
  const [pin, setPin] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const handleSave = () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setSavedMessage('PIN must be 4 digits')
      return
    }
    setSavedMessage(`PIN saved for ${selectedUser}`)
    setPin('')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleReset = () => {
    setPin(selectedUser === 'husband' ? '0000' : '1111')
  }

  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <h2 className="text-lg font-semibold text-white">PIN Settings</h2>
      <p className="mt-1 text-xs text-slate-300/80">Select user and set/reset PIN</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => { setSelectedUser('husband'); setPin('') }}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            selectedUser === 'husband'
              ? 'border-neon-blue/70 bg-neon-blue/10 text-neon-blue'
              : 'border-white/10 bg-white/5 text-slate-200 hover:border-neon-blue/50'
          }`}
        >
          Husband (Default: 0000)
        </button>
        <button
          onClick={() => { setSelectedUser('wife'); setPin('') }}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            selectedUser === 'wife'
              ? 'border-neon-blue/70 bg-neon-blue/10 text-neon-blue'
              : 'border-white/10 bg-white/5 text-slate-200 hover:border-neon-blue/50'
          }`}
        >
          Wife (Default: 1111)
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="Enter 4-digit PIN"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/60"
          maxLength={4}
        />
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:border-neon-blue/50 hover:text-white"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg border border-neon-blue/40 bg-neon-blue/10 px-3 py-2 text-sm font-semibold text-neon-blue hover:border-neon-blue/70 hover:bg-neon-blue/20"
          >
            Save PIN
          </button>
        </div>
        {savedMessage && (
          <p className="text-xs text-emerald-300">{savedMessage}</p>
        )}
      </div>
    </div>
  )
}