const http = require('http');

const PORT = process.env.PORT || 3002;

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Wedding app backend is running' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Wedding app backend is ready' }));
});

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
