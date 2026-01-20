import express from 'express';

/**
 * Configuration routes for managing load balancer settings
 */
export function createConfigRoutes(loadBalancer) {
  const router = express.Router();

  /**
   * GET /api/config/servers - Get all backend servers
   */
  router.get('/servers', (req, res) => {
    try {
      const servers = loadBalancer.getServers().map(server => server.getStatus());
      res.json({
        success: true,
        data: servers,
        count: servers.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/config/servers/:id - Get specific server
   */
  router.get('/servers/:id', (req, res) => {
    try {
      const server = loadBalancer.getServer(req.params.id);
      if (!server) {
        return res.status(404).json({
          success: false,
          error: `Server with id ${req.params.id} not found`
        });
      }
      res.json({
        success: true,
        data: server.getStatus()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * POST /api/config/servers - Add a new backend server
   */
  router.post('/servers', (req, res) => {
    try {
      const { id, url, weight, healthCheckPath } = req.body;

      if (!id || !url) {
        return res.status(400).json({
          success: false,
          error: 'id and url are required'
        });
      }

      const server = loadBalancer.addServer(
        id,
        url,
        weight || 1,
        healthCheckPath || '/health'
      );

      res.status(201).json({
        success: true,
        message: 'Server added successfully',
        data: server.getStatus()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * PUT /api/config/servers/:id - Update server configuration
   */
  router.put('/servers/:id', (req, res) => {
    try {
      const { url, weight, healthCheckPath } = req.body;
      const updates = {};

      if (url !== undefined) updates.url = url;
      if (weight !== undefined) updates.weight = weight;
      if (healthCheckPath !== undefined) updates.healthCheckPath = healthCheckPath;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No updates provided'
        });
      }

      const server = loadBalancer.updateServer(req.params.id, updates);
      res.json({
        success: true,
        message: 'Server updated successfully',
        data: server.getStatus()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * DELETE /api/config/servers/:id - Remove a backend server
   */
  router.delete('/servers/:id', (req, res) => {
    try {
      loadBalancer.removeServer(req.params.id);
      res.json({
        success: true,
        message: `Server ${req.params.id} removed successfully`
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * PUT /api/config/timeout - Update request timeout
   */
  router.put('/timeout', (req, res) => {
    try {
      const { timeout } = req.body;

      if (!timeout || timeout <= 0) {
        return res.status(400).json({
          success: false,
          error: 'timeout must be a positive number'
        });
      }

      loadBalancer.setTimeout(timeout);
      res.json({
        success: true,
        message: 'Timeout updated successfully',
        data: {
          timeout: loadBalancer.getTimeout()
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/config/timeout - Get current timeout
   */
  router.get('/timeout', (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          timeout: loadBalancer.getTimeout()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * PUT /api/config/algorithm - Change load balancing algorithm
   */
  router.put('/algorithm', (req, res) => {
    try {
      const { algorithm } = req.body;

      if (!algorithm) {
        return res.status(400).json({
          success: false,
          error: 'algorithm is required'
        });
      }

      loadBalancer.setAlgorithm(algorithm);
      res.json({
        success: true,
        message: 'Algorithm updated successfully',
        data: {
          algorithm: loadBalancer.getAlgorithmName()
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/config/algorithm - Get current algorithm
   */
  router.get('/algorithm', (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          algorithm: loadBalancer.getAlgorithmName()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/config/stats - Get load balancer statistics
   */
  router.get('/stats', (req, res) => {
    try {
      const stats = loadBalancer.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/config/requests - Get detailed request distribution per server
   */
  router.get('/requests', (req, res) => {
    try {
      const distribution = loadBalancer.getRequestDistribution();
      res.json({
        success: true,
        data: distribution
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

