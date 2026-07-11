const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002;
const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp' : __dirname;
const RECEIPTS_DIR = path.join(DATA_DIR, 'receipts');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const DATA_LOCK = path.join(DATA_DIR, 'data.lock');

function withFileLock(fn) {
  let retries = 20;
  let delay = 50;
  while (retries-- > 0) {
    try {
      fs.mkdirSync(DATA_LOCK, { recursive: true });
      fn();
      fs.rmdirSync(DATA_LOCK);
      return;
    } catch {
      if (retries <= 0) throw new Error('Data file locked');
      const wait = require('timers/promises').setTimeout;
      wait(delay);
      delay = Math.min(delay * 2, 500);
    }
  }
}

if (!fs.existsSync(RECEIPTS_DIR)) {
  fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    savingsGoal: {
      name: 'Our Dream Wedding 💕',
      target: 50000,
      current: 18200,
      currency: 'RM',
      history: []
    },
    receipts: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

const readData = () => {
  const rawData = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(rawData);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

async function handler(req, res) {
  let url = req.url;
  if (url.startsWith('/api/backend')) {
    url = url.slice('/api/backend'.length) || '/';
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Wedding app backend is running' }));
    return;
  }

  if (req.url === '/api/savings' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.savingsGoal));
    return;
  }

  if (req.url === '/api/savings/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { amount, note = 'Manual contribution' } = JSON.parse(body);
        withFileLock(() => {
          const data = readData();
          data.savingsGoal.current += amount;
          data.savingsGoal.history.push({ amount, timestamp: new Date().toISOString(), note });
          writeData(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, newTotal: data.savingsGoal.current, message: `Added ${amount} to savings` }));
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request', details: error.message }));
      }
    });
    return;
  }

  if (req.url === '/api/savings/set-goal' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        withFileLock(() => {
          const data = readData();
          data.savingsGoal = { ...data.savingsGoal, ...updates };
          writeData(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, goal: data.savingsGoal, message: 'Savings goal updated' }));
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request', details: error.message }));
      }
    });
    return;
  }

  if (req.url === '/api/savings/history' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.savingsGoal.history || []));
    return;
  }

  if (req.url === '/api/receipts/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const receipt = JSON.parse(body);
        withFileLock(() => {
          const data = readData();
          const newReceipt = { id: Date.now(), ...receipt, savedAt: new Date().toISOString() };
          if (receipt.amount) {
            data.savingsGoal.current += receipt.amount;
            data.savingsGoal.history.push({ amount: receipt.amount, timestamp: new Date().toISOString(), note: `OCR scanned receipt - ${receipt.description || 'Receipt upload'}` });
          }
          data.receipts.push(newReceipt);
          writeData(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, receipt: newReceipt, newSavingsTotal: data.savingsGoal.current, message: 'Receipt saved successfully' }));
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request', details: error.message }));
      }
    });
    return;
  }

  if (req.url === '/api/receipts' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.receipts));
    return;
  }

  if (req.url === '/api/reset/all' && req.method === 'POST') {
    withFileLock(() => {
      const resetData = {
        savingsGoal: {
          name: 'Our Dream Wedding 💕',
          target: 50000,
          current: 0,
          currency: 'RM',
          history: []
        },
        receipts: []
      };
      writeData(resetData);
      if (fs.existsSync(RECEIPTS_DIR)) {
        const files = fs.readdirSync(RECEIPTS_DIR);
        files.forEach(file => fs.unlinkSync(path.join(RECEIPTS_DIR, file)));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'All data has been reset to factory defaults' }));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
}

module.exports = handler;

if (require.main === module) {
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`🚀 Wedding App Backend running at http://localhost:${PORT}`);
    console.log(`📊 API Endpoints available:`);
    console.log(`   - GET  /api/health          - Health check`);
    console.log(`   - GET  /api/savings          - Get current savings`);
    console.log(`   - POST /api/savings/add      - Add to savings`);
    console.log(`   - PUT  /api/savings/set-goal - Update savings goal`);
    console.log(`   - GET  /api/savings/history  - Get savings history`);
    console.log(`   - GET  /api/receipts         - Get all saved receipts`);
    console.log(`   - POST /api/receipts/save    - Save a scanned receipt`);
  });
}
