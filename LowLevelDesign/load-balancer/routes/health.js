import express from 'express';

/**
 * Health check routes
 */
export function createHealthRoutes(loadBalancer) {
  const router = express.Router();

  /**
   * GET /api/health - Load balancer health check
   */
  router.get('/', (req, res) => {
    try {
      const stats = loadBalancer.getStats();
      const isHealthy = stats.healthyServers > 0;

      res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy 
          ? 'Load balancer is operational' 
          : 'No healthy backend servers available',
        data: {
          healthyServers: stats.healthyServers,
          totalServers: stats.totalServers,
          algorithm: stats.algorithm
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: 'error',
        error: error.message
      });
    }
  });

  /**
   * POST /api/health/check - Manually trigger health check for all servers
   */
  router.post('/check', async (req, res) => {
    try {
      await loadBalancer.performHealthChecks();
      const servers = loadBalancer.getServers().map(server => ({
        id: server.id,
        url: server.url,
        isHealthy: server.isHealthy,
        lastHealthCheck: server.lastHealthCheck,
        responseTime: server.responseTime
      }));

      res.json({
        success: true,
        message: 'Health check completed',
        data: servers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/health/servers - Get health status of all servers
   */
  router.get('/servers', (req, res) => {
    try {
      const servers = loadBalancer.getServers().map(server => ({
        id: server.id,
        url: server.url,
        isHealthy: server.isHealthy,
        lastHealthCheck: server.lastHealthCheck,
        responseTime: server.responseTime,
        activeConnections: server.activeConnections
      }));

      res.json({
        success: true,
        data: servers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}

