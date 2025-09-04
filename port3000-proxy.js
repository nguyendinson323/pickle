#!/usr/bin/env node
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Simple proxy to forward port 3000 to port 3001
const proxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
  }
});

const server = http.createServer((req, res) => {
  proxy(req, res, (err) => {
    if (err) {
      res.writeHead(500);
      res.end('Proxy error');
    }
  });
});

// Handle WebSocket upgrades for hot reloading
server.on('upgrade', (req, socket, head) => {
  proxy.upgrade(req, socket, head);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🔀 Proxy running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding to http://localhost:3001`);
  console.log(`✅ Access your app at http://localhost:3000`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`🔧 Please use: http://localhost:3001 instead`);
    process.exit(1);
  }
  console.error('Server error:', err);
});