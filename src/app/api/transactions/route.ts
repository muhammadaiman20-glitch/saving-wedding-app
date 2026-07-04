import { NextRequest, NextResponse } from 'next/server'

interface Transaction {
  id: number
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
}

declare global {
  var transactions: Transaction[] | undefined
}

const getTransactions = (): Transaction[] => {
  if (!global.transactions) {
    global.transactions = [
      { id: 1, type: 'income', category: 'Salary', description: 'Monthly salary', amount: 5000, date: '2026-07-01' },
      { id: 2, type: 'expense', category: 'Housing', description: 'Rent payment', amount: 1200, date: '2026-07-02' },
    ]
  }
  return global.transactions
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') as 'all' | 'income' | 'expense' | null
  
  const transactions = getTransactions()
  const filtered = filter && filter !== 'all' 
    ? transactions.filter(t => t.type === filter) 
    : transactions
  
  return NextResponse.json(filtered)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const transactions = getTransactions()
  
  const newTransaction: Transaction = {
    id: Date.now(),
    type: body.type,
    category: body.category,
    description: body.description || '',
    amount: parseFloat(body.amount),
    date: body.date
  }
  
  transactions.unshift(newTransaction)
  return NextResponse.json(newTransaction, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  
  const transactions = getTransactions()
  global.transactions = transactions.filter(t => t.id !== parseInt(id))
  
  return NextResponse.json({ success: true })
}