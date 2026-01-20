import express from 'express';
import cors from 'cors';
import { LoadBalancer } from './LoadBalancer.js';
import { createConfigRoutes } from './routes/config.js';
import { createHealthRoutes } from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Load Balancer
const loadBalancer = new LoadBalancer({
  algorithm: 'round-robin',
  timeout: 5000,
  healthCheckInterval: 10000,
  healthCheckTimeout: 3000,
  healthCheckEnabled: true
});

// Configuration routes (not load balanced)
app.use('/api/config', createConfigRoutes(loadBalancer));

// Health check routes (not load balanced)
app.use('/api/health', createHealthRoutes(loadBalancer));

// Load balanced routes - all other routes are forwarded to backend servers
app.all('*', async (req, res) => {
  try {
    const result = await loadBalancer.forwardRequest(
      req.method,
      req.path,
      req.headers,
      req.body,
      req.query
    );

    // Log which server received the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${result.serverId} (${result.serverUrl}) [${result.responseTime}ms]`);

    // Forward response from backend server
    res.status(result.status);
    
    // Copy relevant headers (excluding hop-by-hop headers)
    const excludedHeaders = ['connection', 'transfer-encoding', 'content-encoding'];
    Object.keys(result.headers).forEach(key => {
      if (!excludedHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, result.headers[key]);
      }
    });

    res.json({
      ...result.data,
      _metadata: {
        serverId: result.serverId,
        serverUrl: result.serverUrl,
        responseTime: result.responseTime,
        loadBalanced: true
      }
    });
  } catch (error) {
    console.error('Load balancing error:', error.message);
    
    if (error.message === 'No healthy servers available') {
      res.status(503).json({
        success: false,
        error: 'No healthy backend servers available',
        message: 'Please add backend servers or check server health'
      });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(502).json({
        success: false,
        error: 'Backend server connection refused',
        message: error.message
      });
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      res.status(504).json({
        success: false,
        error: 'Request timeout',
        message: 'Backend server did not respond in time'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  loadBalancer.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  loadBalancer.destroy();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Load Balancer running on http://localhost:${PORT}`);
  console.log(`📊 Config API: http://localhost:${PORT}/api/config`);
  console.log(`❤️  Health API: http://localhost:${PORT}/api/health`);
  console.log(`\n💡 Add backend servers using: POST /api/config/servers`);
  console.log(`   Example: { "id": "server1", "url": "http://localhost:3001" }`);
});

export { app, loadBalancer };

