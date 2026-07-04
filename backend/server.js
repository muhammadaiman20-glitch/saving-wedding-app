const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002;
const RECEIPTS_DIR = path.join(__dirname, 'receipts');
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data directories exist
if (!fs.existsSync(RECEIPTS_DIR)) {
  fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

// Initialize data file if it doesn't exist
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

const server = http.createServer((req, res) => {
  // Enable full CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Wedding app backend is running' }));
    return;
  }

  // Get current savings goal
  if (req.url === '/api/savings' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.savingsGoal));
    return;
  }

  // Update savings
  if (req.url === '/api/savings/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { amount, note = 'Manual contribution' } = JSON.parse(body);
        const data = readData();
        
        data.savingsGoal.current += amount;
        data.savingsGoal.history.push({
          amount,
          timestamp: new Date().toISOString(),
          note
        });
        
        writeData(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          newTotal: data.savingsGoal.current,
          message: `Added ${amount} to savings` 
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request', details: error.message }));
      }
    });
    return;
  }

  // Set savings goal
  if (req.url === '/api/savings/set-goal' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readData();
        
        data.savingsGoal = { ...data.savingsGoal, ...updates };
        writeData(data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          goal: data.savingsGoal,
          message: 'Savings goal updated' 
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request', details: error.message }));
      }
    });
    return;
  }

  // Get savings history
  if (req.url === '/api/savings/history' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.savingsGoal.history || []));
    return;
  }

  // Save scanned receipt
  if (req.url === '/api/receipts/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const receipt = JSON.parse(body);
        const data = readData();
        
        const newReceipt = {
          id: Date.now(),
          ...receipt,
          savedAt: new Date().toISOString()
        };
        
        // If receipt has an amount, add it to savings automatically
        if (receipt.amount) {
          data.savingsGoal.current += receipt.amount;
          data.savingsGoal.history.push({
            amount: receipt.amount,
            timestamp: new Date().toISOString(),
            note: `OCR scanned receipt - ${receipt.description || 'Receipt upload'}`
          });
        }
        
        data.receipts.push(newReceipt);
        writeData(data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          receipt: newReceipt,
          newSavingsTotal: data.savingsGoal.current,
          message: 'Receipt saved successfully' 
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request', details: error.message }));
      }
    });
    return;
  }

  // Get all receipts
  if (req.url === '/api/receipts' && req.method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.receipts));
    return;
  }

  // Full reset - reset all data to defaults
  if (req.url === '/api/reset/all' && req.method === 'POST') {
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
    
    // Also clear the receipts directory
    if (fs.existsSync(RECEIPTS_DIR)) {
      const files = fs.readdirSync(RECEIPTS_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(RECEIPTS_DIR, file));
      });
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      message: 'All data has been reset to factory defaults' 
    }));
    return;
  }

  // 404 for any other endpoint
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

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