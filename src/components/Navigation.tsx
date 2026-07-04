'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/savings', label: 'Marriage Savings', icon: '💍' },
  { href: '/subscriptions', label: 'Subscriptions', icon: '🧾' },
  { href: '/debt', label: 'Debt Management', icon: '📉' },
  { href: '/ai-advisor', label: 'AI Advisor', icon: '🤖' },
  { href: '/income-expenses', label: 'Income/Expenses', icon: '💰' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showChangePinModal, setShowChangePinModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [pin, setPin] = useState('')
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')
  const [currentUserType, setCurrentUserType] = useState<'husband' | 'wife' | null>(null)
  
  // Load saved PINs from localStorage
  const [husbandPin, setHusbandPin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('husbandPin') || '0000'
    }
    return '0000'
  })
  
  const [wifePin, setWifePin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wifePin') || '1111'
    }
    return '1111'
  })

  const [newPin, setNewPin] = useState('')
  const [confirmNewPin, setConfirmNewPin] = useState('')

  // Save PINs to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('husbandPin', husbandPin)
      localStorage.setItem('wifePin', wifePin)
    }
  }, [husbandPin, wifePin])

  const handlePinSubmit = () => {
    if (pin === husbandPin) {
      setLoggedInUser('Husband')
      setCurrentUserType('husband')
      setShowPinModal(false)
      setPin('')
      setError('')
    } else if (pin === wifePin) {
      setLoggedInUser('Wife')
      setCurrentUserType('wife')
      setShowPinModal(false)
      setPin('')
      setError('')
    } else {
      setError('Invalid PIN. Please try again.')
      setPin('')
    }
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    setCurrentUserType(null)
    setSettingsOpen(false)
  }

  const handleChangePin = () => {
    if (newPin.length !== 4) {
      setError('PIN must be 4 digits')
      return
    }
    if (newPin !== confirmNewPin) {
      setError('PINs do not match')
      return
    }
    
    if (currentUserType === 'husband') {
      setHusbandPin(newPin)
    } else if (currentUserType === 'wife') {
      setWifePin(newPin)
    }
    
    setShowChangePinModal(false)
    setNewPin('')
    setConfirmNewPin('')
    setError('')
    setSettingsOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showChangePinModal) {
        handleChangePin()
      } else {
        handlePinSubmit()
      }
    }
  }

  const addDigit = (digit: string) => {
    if (showChangePinModal) {
      if (newPin.length < 4) setNewPin(prev => prev + digit)
    } else {
      if (pin.length < 4) setPin(prev => prev + digit)
    }
  }

  const clearPin = () => {
    if (showChangePinModal) {
      setNewPin('')
      setConfirmNewPin('')
    } else {
      setPin('')
    }
    setError('')
  }

  const backspace = () => {
    if (showResetModal) {
      if (resetConfirm.length > 0) setResetConfirm(prev => prev.slice(0, -1))
    } else if (showChangePinModal) {
      if (confirmNewPin.length > 0) setConfirmNewPin(prev => prev.slice(0, -1))
      else if (newPin.length > 0) setNewPin(prev => prev.slice(0, -1))
    } else {
      setPin(prev => prev.slice(0, -1))
    }
  }

  const clearAll = () => {
    if (showResetModal) {
      setResetConfirm('')
    } else if (showChangePinModal) {
      setNewPin('')
      setConfirmNewPin('')
    } else {
      setPin('')
    }
    setError('')
  }

  const addDigitReset = (digit: string) => {
    if (showResetModal && resetConfirm.length < 6) {
      setResetConfirm(prev => prev + digit)
    }
  }

  const handleTotalReset = async () => {
    if (resetConfirm !== 'RESET12') {
      setError('Please enter "RESET12" to confirm full reset')
      return
    }

    try {
      // Call backend to reset all data
      const response = await fetch('http://localhost:3002/api/reset/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        // Reset localStorage PINs to defaults
        localStorage.removeItem('husbandPin')
        localStorage.removeItem('wifePin')
        setHusbandPin('0000')
        setWifePin('1111')
        
        // Logout user
        setLoggedInUser(null)
        setCurrentUserType(null)
        setShowResetModal(false)
        setResetConfirm('')
        setError('')
        
        alert('✅ All data has been reset to factory defaults!')
        window.location.reload()
      } else {
        setError('Failed to reset data. Please try again.')
      }
    } catch (error) {
      setError('Error connecting to server. Reset failed.')
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#00c8ff]/30 backdrop-blur-xl pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 group/logo"
            >
              <span className="text-2xl">💕</span>
              <span className="text-xl font-bold neon-text group-hover/logo:scale-105 transition-transform duration-300">
                Saving Wedding
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                      ${isActive 
                        ? 'bg-[#00c8ff]/20 border border-[#00c8ff]/50 text-[#00c8ff]' 
                        : 'text-slate-300 hover:text-[#00c8ff] hover:bg-white/5 border border-transparent'
                      }`}
                    style={isActive ? { boxShadow: '0 0 20px rgba(0, 200, 255, 0.3)' } : {}}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 200, 255, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <span>{link.icon}</span>
                    <span className="text-sm font-medium">{link.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-lg pointer-events-none" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Settings Button */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-[#00c8ff] hover:bg-white/5 border border-transparent transition-all duration-300"
              >
                <span className="text-xl">⚙️</span>
                {loggedInUser && <span className="text-sm font-medium hidden sm:inline">👤 {loggedInUser}</span>}
              </button>

              {/* Settings Dropdown */}
              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl p-3 z-50">
                  {!loggedInUser ? (
                    <button
                      onClick={() => { setShowPinModal(true); setSettingsOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-300 hover:text-[#00c8ff]"
                    >
                      <span>🔐</span>
                      <span>Login with PIN</span>
                    </button>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-white/10 mb-2">
                        <p className="text-sm text-slate-400">Logged in as</p>
                        <p className="text-[#00c8ff] font-semibold">{loggedInUser}</p>
                      </div>
                      <button
                        onClick={() => { setShowChangePinModal(true); setSettingsOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-300 hover:text-[#00c8ff]"
                      >
                        <span>🔄</span>
                        <span>Change PIN</span>
                      </button>
                      <button
                        onClick={() => { setShowChangePinModal(true); setSettingsOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-300 hover:text-[#00c8ff]"
                      >
                        <span>🔄</span>
                        <span>Change PIN</span>
                      </button>
                      <hr className="border-white/10 my-2" />
                      <button
                        onClick={() => { setShowResetModal(true); setSettingsOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-300 hover:text-orange-400"
                      >
                        <span>⚠️</span>
                        <span>Total Reset</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-300 hover:text-red-400 mt-1"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <span className="text-2xl">☰</span>
            </div>
          </div>
        </div>
      </nav>

      {/* PIN Input Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => { setShowPinModal(false); setError(''); setPin(''); }}>
          <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center mb-2 neon-text">🔐 Enter PIN</h2>
            <p className="text-slate-400 text-center mb-6 text-sm">Husband: 0000 | Wife: 1111</p>
            
            {/* PIN Display */}
            <div className="flex justify-center gap-3 mb-6">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all ${pin.length > i ? 'bg-[#00c8ff] shadow-[0_0_10px_rgba(0,200,255,0.8)]' : 'bg-white/20'}`} />
              ))}
            </div>

            {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6,7,8,9,'C',0,'⌫'].map((key, i) => (
                <button
                  key={i}
                  onClick={() => key === 'C' ? clearAll() : key === '⌫' ? backspace() : addDigit(String(key))}
                  className={`aspect-square text-xl font-semibold rounded-xl transition-all ${
                    key === 'C' || key === '⌫' 
                      ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400' 
                      : 'bg-white/10 hover:bg-[#00c8ff]/30 text-white hover:text-[#00c8ff] hover:shadow-[0_0_20px_rgba(0,200,255,0.3)]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                pin.length === 4 
                  ? 'bg-[#00c8ff]/30 text-[#00c8ff] hover:bg-[#00c8ff]/50 shadow-[0_0_20px_rgba(0,200,255,0.4)]' 
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              Unlock
            </button>

            <button
              onClick={() => { setShowPinModal(false); setError(''); setPin(''); }}
              className="w-full mt-3 py-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => { setShowChangePinModal(false); setError(''); setNewPin(''); setConfirmNewPin(''); }}>
          <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center mb-2 neon-text">🔄 Change PIN</h2>
            <p className="text-slate-400 text-center mb-6 text-sm">Create a new 4-digit PIN</p>
            
            {/* New PIN Display */}
            <p className="text-center text-sm text-slate-400 mb-2">New PIN</p>
            <div className="flex justify-center gap-3 mb-4">
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all ${newPin.length > i ? 'bg-[#00c8ff] shadow-[0_0_10px_rgba(0,200,255,0.8)]' : 'bg-white/20'}`} />
              ))}
            </div>

            {/* Confirm PIN Display */}
            {newPin.length === 4 && (
              <>
                <p className="text-center text-sm text-slate-400 mb-2">Confirm PIN</p>
                <div className="flex justify-center gap-3 mb-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-4 h-4 rounded-full transition-all ${confirmNewPin.length > i ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-white/20'}`} />
                  ))}
                </div>
              </>
            )}

            {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6,7,8,9,'C',0,'⌫'].map((key, i) => (
                <button
                  key={i}
                  onClick={() => key === 'C' ? clearAll() : key === '⌫' ? backspace() : addDigit(String(key))}
                  className={`aspect-square text-xl font-semibold rounded-xl transition-all ${
                    key === 'C' || key === '⌫' 
                      ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400' 
                      : 'bg-white/10 hover:bg-[#00c8ff]/30 text-white hover:text-[#00c8ff] hover:shadow-[0_0_20px_rgba(0,200,255,0.3)]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={handleChangePin}
              disabled={newPin.length !== 4 || confirmNewPin.length !== 4}
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                newPin.length === 4 && confirmNewPin.length === 4
                  ? 'bg-green-500/30 text-green-400 hover:bg-green-500/50 shadow-[0_0_20px_rgba(74,222,128,0.4)]' 
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              Save New PIN
            </button>

            <button
              onClick={() => { setShowChangePinModal(false); setError(''); setNewPin(''); setConfirmNewPin(''); }}
              className="w-full mt-3 py-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Total Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => { setShowResetModal(false); setError(''); setResetConfirm(''); }}>
          <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4 border-2 border-orange-500/50" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center mb-2 text-orange-400">⚠️ TOTAL RESET</h2>
            <p className="text-slate-400 text-center mb-2 text-sm">This will erase ALL data!</p>
            <p className="text-orange-300 text-center mb-6 text-sm font-mono">Enter "RESET12" to confirm</p>
            
            {/* Reset Confirmation Display */}
            <div className="flex justify-center gap-2 mb-6">
              {['R','E','S','E','T','1','2'].slice(0,6).map((letter, i) => (
                <div key={i} className={`w-6 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${resetConfirm.length > i ? 'bg-orange-500/50 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-white/20 text-white/30'}`}>
                  {resetConfirm[i] || '_'}
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}

            {/* Letter Keypad for reset confirmation */}
            <div className="grid grid-cols-3 gap-2">
              {['R','E','S','T','1','2','C','0','⌫'].map((key, i) => (
                <button
                  key={i}
                  onClick={() => key === 'C' ? clearAll() : key === '⌫' ? backspace() : addDigitReset(key)}
                  className={`aspect-square text-sm font-semibold rounded-xl transition-all ${
                    key === 'C' || key === '⌫' 
                      ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400' 
                      : 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={handleTotalReset}
              disabled={resetConfirm.length !== 6}
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                resetConfirm.length === 6 
                  ? 'bg-orange-500/30 text-orange-400 hover:bg-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              🔄 Reset Everything
            </button>

            <button
              onClick={() => { setShowResetModal(false); setError(''); setResetConfirm(''); }}
              className="w-full mt-3 py-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close settings dropdown */}
      {settingsOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setSettingsOpen(false)}
        />
      )}
    </>
  )
}