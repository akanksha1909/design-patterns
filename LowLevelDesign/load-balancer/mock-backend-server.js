import express from 'express';

/**
 * Mock Backend Server for testing the load balancer
 * Run multiple instances with different ports to test load balancing
 * 
 * Usage: PORT=3001 node mock-backend-server.js
 *        PORT=3002 node mock-backend-server.js
 *        PORT=3003 node mock-backend-server.js
 */

const app = express();
const PORT = process.env.PORT || 3001;
const SERVER_ID = process.env.SERVER_ID || `server-${PORT}`;

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`[${timestamp}] ${SERVER_ID} → ${req.method} ${req.path}`);
  
  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${SERVER_ID} ← ${req.method} ${req.path} [${res.statusCode}] [${duration}ms]`);
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    serverId: SERVER_ID,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Simulate some delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
app.get('/api/users', async (req, res) => {
  await delay(Math.random() * 100); // Random delay 0-100ms
  res.json({
    success: true,
    data: [
      { id: 1, name: 'User 1', server: SERVER_ID },
      { id: 2, name: 'User 2', server: SERVER_ID },
      { id: 3, name: 'User 3', server: SERVER_ID }
    ],
    serverId: SERVER_ID,
    port: PORT
  });
});

app.get('/api/users/:id', async (req, res) => {
  await delay(Math.random() * 100);
  res.json({
    success: true,
    data: {
      id: parseInt(req.params.id),
      name: `User ${req.params.id}`,
      server: SERVER_ID
    },
    serverId: SERVER_ID,
    port: PORT
  });
});

app.post('/api/users', async (req, res) => {
  await delay(Math.random() * 100);
  res.json({
    success: true,
    message: 'User created',
    data: {
      id: Math.floor(Math.random() * 1000),
      ...req.body,
      server: SERVER_ID
    },
    serverId: SERVER_ID,
    port: PORT
  });
});

app.get('/api/products', async (req, res) => {
  await delay(Math.random() * 100);
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Product 1', price: 100, server: SERVER_ID },
      { id: 2, name: 'Product 2', price: 200, server: SERVER_ID }
    ],
    serverId: SERVER_ID,
    port: PORT
  });
});

// Generic catch-all for testing
app.all('*', async (req, res) => {
  await delay(Math.random() * 100);
  res.json({
    success: true,
    message: 'Request received',
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    serverId: SERVER_ID,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Mock Backend Server ${SERVER_ID} running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

