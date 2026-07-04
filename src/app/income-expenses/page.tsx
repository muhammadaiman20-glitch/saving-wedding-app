'use client'

import { useState } from 'react'

interface Transaction {
  id: number
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
}

const categories = {
  income: ['Salary', 'Investment', 'Gift', 'Freelance', 'Other'],
  expense: ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']
}

export default function IncomeExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'income', category: 'Salary', description: 'Monthly salary', amount: 5000, date: '2026-07-01' },
    { id: 2, type: 'expense', category: 'Housing', description: 'Rent payment', amount: 1200, date: '2026-07-02' },
    { id: 3, type: 'expense', category: 'Food', description: 'Groceries', amount: 350, date: '2026-07-03' },
  ])
  const [newTransaction, setNewTransaction] = useState({ type: 'income' as 'income' | 'expense', category: '', description: '', amount: '', date: '' })
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const addTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.date) return
    const transaction: Transaction = {
      id: Date.now(),
      type: newTransaction.type,
      category: newTransaction.category,
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      date: newTransaction.date
    }
    setTransactions([transaction, ...transactions])
    setNewTransaction({ type: 'income', category: '', description: '', amount: '', date: '' })
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const filteredTransactions = transactions.filter(t => filter === 'all' || t.type === filter)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  return (
    <main className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="neon-text">Income & Expenses</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Track your income and expenses to manage your wedding savings effectively.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-6 text-center">
            <span className="text-3xl block mb-2">💰</span>
            <p className="text-slate-300/80 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-emerald-300">RM {totalIncome.toLocaleString()}</p>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <span className="text-3xl block mb-2">💸</span>
            <p className="text-slate-300/80 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-rose-300">RM {totalExpenses.toLocaleString()}</p>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <span className="text-3xl block mb-2">📊</span>
            <p className="text-slate-300/80 text-sm">Net Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>RM {balance.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add Transaction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Type</label>
              <select 
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense', category: ''})}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none"
              >
                <option value="income">Income 💰</option>
                <option value="expense">Expense 💸</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Category</label>
              <select 
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none"
              >
                <option value="">Select category</option>
                {categories[newTransaction.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Description</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                placeholder="Optional note..."
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300/60"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Amount</label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                placeholder="0.00"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300/60"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-slate-300 text-sm mb-1 block">Date</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              className="w-full md:w-auto rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none"
            />
          </div>
          <button 
            onClick={addTransaction}
            className="mt-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 text-white font-semibold hover:scale-105 transition-transform"
          >
            Add Transaction 💕
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="glass rounded-xl overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <p className="p-6 text-center text-slate-400">No transactions recorded yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-300">Date</th>
                  <th className="text-left p-4 text-slate-300">Type</th>
                  <th className="text-left p-4 text-slate-300">Category</th>
                  <th className="text-left p-4 text-slate-300">Description</th>
                  <th className="text-right p-4 text-slate-300">Amount</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{t.date}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {t.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{t.category}</td>
                    <td className="p-4 text-slate-300">{t.description || '-'}</td>
                    <td className={`p-4 text-right font-semibold ${t.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {t.type === 'income' ? '+' : '-'}RM {t.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}