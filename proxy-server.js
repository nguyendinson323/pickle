const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true, // enable websocket proxying
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res && !res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  }
});

// Create HTTP server that proxies to port 3001
const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

// Handle websocket upgrade for HMR
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Try to start on port 3000, but handle if it's occupied
const PORT = 3000;
server.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start proxy on port ${PORT}:`, err);
    console.log('Please access the application directly at http://localhost:3001');
  } else {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Forwarding all requests to http://localhost:3001`);
    console.log(`✅ You can now access the application at http://localhost:3000`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use.`);
    console.log(`✅ Please access the application directly at http://localhost:3001`);
    console.log(`🔗 Home: http://localhost:3001/`);
    console.log(`🔗 Learn More: http://localhost:3001/about`);
  } else {
    console.error('Server error:', err);
  }
});