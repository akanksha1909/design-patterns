import express from 'express';
import configRoutes from './routes/config.route.js';
import healthRoutes from './routes/health.route.js';
import { LoadBalancer } from './LoadBalancer.js'

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("server running")
})

const loadBalancer = new LoadBalancer({
    algorithm: "round-robin",
    timeout: 5000,
    healthCheckInterval: 10000,
    healthCheckTimeout: 3000,
    healthCheckEnabled: true
});

app.use('/api/config', configRoutes(loadBalancer));
app.use("/api/health", healthRoutes(loadBalancer));

// Catch-all route for forwarding to backend servers (excludes load balancer's own API routes)
app.use(async (req, res) => {
  // Skip forwarding for load balancer's own API routes
  if (req.path.startsWith('/api/config') || req.path.startsWith('/api/health')) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: `Route ${req.path} not found`
    });
  }
  try {
    const result = await loadBalancer.forwardRequest(
      req.method,
      req.path,
      req.headers,
      req.body,
      req.query
    );

    // Log which server received the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${result.serverId} (${result.serverUrl})`);

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
        // responseTime: result.responseTime,
        loadBalanced: true
      }
    });
  } catch (error) {
    console.error('Load balancing error:', error.message);
    
    if (error.message === 'No healthy servers available') {
      res.status(503).json({
        success: false,
        error: 'No healthy backend servers available',
        message: 'Please add backend servers or check server health',
        hint: 'Use POST /api/config/servers to add servers, or GET /api/config/servers to view registered servers'
      });
    } else if (error.message.includes('No servers registered')) {
      res.status(503).json({
        success: false,
        error: 'No servers registered',
        message: error.message,
        hint: 'Use POST /api/config/servers to add backend servers. Example: { "id": "server1", "url": "http://localhost:3001" }'
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