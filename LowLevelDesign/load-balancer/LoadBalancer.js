import axios from 'axios';
import { BackendServer } from './BackendServer.js';
import { RoundRobin } from './algorithms/RoundRobin.js';
import { LeastConnections } from './algorithms/LeastConnections.js';
import { WeightedRoundRobin } from './algorithms/WeightedRoundRobin.js';
import { Random } from './algorithms/Random.js';

/**
 * Main Load Balancer class
 * Manages backend servers, health checks, and request routing
 */
export class LoadBalancer {
  constructor(options = {}) {
    this.servers = new Map(); // Map<id, BackendServer>
    
    // Available algorithms map for easy switching
    this.availableAlgorithms = {
      'round-robin': RoundRobin,
      'least-connections': LeastConnections,
      'weighted-round-robin': WeightedRoundRobin,
      'random': Random
    };

    // Initialize algorithm - support both string and instance
    if (options.algorithm) {
      if (typeof options.algorithm === 'string') {
        const AlgorithmClass = this.availableAlgorithms[options.algorithm];
        this.algorithm = AlgorithmClass ? new AlgorithmClass() : new RoundRobin();
      } else {
        this.algorithm = options.algorithm;
      }
    } else {
      this.algorithm = new RoundRobin();
    }

    this.timeout = options.timeout || 5000; // Request timeout in ms
    this.healthCheckInterval = options.healthCheckInterval || 10000; // Health check interval in ms
    this.healthCheckTimeout = options.healthCheckTimeout || 3000; // Health check timeout in ms
    this.healthCheckEnabled = options.healthCheckEnabled !== false;
    this.healthCheckTimer = null;

    if (this.healthCheckEnabled) {
      this.startHealthChecks();
    }
  }

  /**
   * Add a backend server to the pool
   */
  addServer(id, url, weight = 1, healthCheckPath = '/health') {
    if (this.servers.has(id)) {
      throw new Error(`Server with id ${id} already exists`);
    }

    const server = new BackendServer(id, url, weight, healthCheckPath);
    this.servers.set(id, server);
    
    // Perform initial health check
    if (this.healthCheckEnabled) {
      this.checkServerHealth(server);
    }

    return server;
  }

  /**
   * Remove a backend server from the pool
   */
  removeServer(id) {
    if (!this.servers.has(id)) {
      throw new Error(`Server with id ${id} does not exist`);
    }

    this.servers.delete(id);
    return true;
  }

  /**
   * Update server configuration
   */
  updateServer(id, updates) {
    const server = this.servers.get(id);
    if (!server) {
      throw new Error(`Server with id ${id} does not exist`);
    }

    if (updates.url !== undefined) {
      server.url = updates.url;
    }
    if (updates.weight !== undefined) {
      server.weight = updates.weight;
    }
    if (updates.healthCheckPath !== undefined) {
      server.healthCheckPath = updates.healthCheckPath;
    }

    return server;
  }

  /**
   * Get all servers
   */
  getServers() {
    return Array.from(this.servers.values());
  }

  /**
   * Get server by ID
   */
  getServer(id) {
    return this.servers.get(id);
  }

  /**
   * Set load balancing algorithm
   */
  setAlgorithm(algorithmName) {
    const AlgorithmClass = this.availableAlgorithms[algorithmName];
    if (!AlgorithmClass) {
      throw new Error(`Unknown algorithm: ${algorithmName}. Available: ${Object.keys(this.availableAlgorithms).join(', ')}`);
    }

    this.algorithm = new AlgorithmClass();
    return this.algorithm;
  }

  /**
   * Get current algorithm name
   */
  getAlgorithmName() {
    return this.algorithm.getName();
  }

  /**
   * Update timeout
   */
  setTimeout(timeout) {
    if (timeout <= 0) {
      throw new Error('Timeout must be greater than 0');
    }
    this.timeout = timeout;
  }

  /**
   * Get timeout
   */
  getTimeout() {
    return this.timeout;
  }

  /**
   * Select next server using the configured algorithm
   */
  selectServer() {
    const servers = Array.from(this.servers.values());
    return this.algorithm.selectServer(servers);
  }

  /**
   * Forward request to selected backend server
   */
  async forwardRequest(method, path, headers = {}, body = null, query = {}) {
    const server = this.selectServer();
    
    if (!server) {
      throw new Error('No healthy servers available');
    }

    try {
      server.incrementConnections();

      const url = `${server.url}${path}`;
      const config = {
        method,
        url,
        headers: {
          ...headers,
          'X-Forwarded-By': 'LoadBalancer',
          'X-Backend-Server': server.id
        },
        params: query,
        timeout: this.timeout,
        validateStatus: () => true // Accept all status codes
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = body;
      }

      const startTime = Date.now();
      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      return {
        status: response.status,
        headers: response.headers,
        data: response.data,
        serverId: server.id,
        serverUrl: server.url,
        responseTime
      };
    } catch (error) {
      // Mark server as unhealthy on timeout or connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        server.updateHealth(false);
      }
      throw error;
    } finally {
      server.decrementConnections();
    }
  }

  /**
   * Check health of a single server
   */
  async checkServerHealth(server) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${server.url}${server.healthCheckPath}`, {
        timeout: this.healthCheckTimeout,
        validateStatus: () => true
      });
      const responseTime = Date.now() - startTime;

      const isHealthy = response.status >= 200 && response.status < 300;
      server.updateHealth(isHealthy, responseTime);
    } catch (error) {
      server.updateHealth(false);
    }
  }

  /**
   * Perform health check on all servers
   */
  async performHealthChecks() {
    const servers = Array.from(this.servers.values());
    const healthCheckPromises = servers.map(server => this.checkServerHealth(server));
    await Promise.all(healthCheckPromises);
  }

  /**
   * Start periodic health checks
   */
  startHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(() => {
      this.performHealthChecks();
    }, this.healthCheckInterval);
  }

  /**
   * Stop health checks
   */
  stopHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Get load balancer statistics
   */
  getStats() {
    const servers = Array.from(this.servers.values());
    const healthyServers = servers.filter(s => s.isHealthy).length;
    const totalConnections = servers.reduce((sum, s) => sum + s.activeConnections, 0);
    const totalRequests = servers.reduce((sum, s) => sum + s.totalRequests, 0);

    return {
      algorithm: this.algorithm.getName(),
      timeout: this.timeout,
      totalServers: servers.length,
      healthyServers,
      unhealthyServers: servers.length - healthyServers,
      totalActiveConnections: totalConnections,
      totalRequests,
      healthCheckEnabled: this.healthCheckEnabled,
      healthCheckInterval: this.healthCheckInterval
    };
  }

  /**
   * Get detailed request distribution across all servers
   */
  getRequestDistribution() {
    const servers = Array.from(this.servers.values());
    const totalRequests = servers.reduce((sum, s) => sum + s.totalRequests, 0);

    const distribution = servers.map(server => {
      const percentage = totalRequests > 0 
        ? ((server.totalRequests / totalRequests) * 100).toFixed(2) 
        : '0.00';

      return {
        id: server.id,
        url: server.url,
        weight: server.weight,
        isHealthy: server.isHealthy,
        totalRequests: server.totalRequests,
        activeConnections: server.activeConnections,
        percentage: `${percentage}%`,
        lastHealthCheck: server.lastHealthCheck,
        responseTime: server.responseTime
      };
    });

    return {
      totalRequests,
      algorithm: this.algorithm.getName(),
      servers: distribution.sort((a, b) => b.totalRequests - a.totalRequests) // Sort by request count
    };
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopHealthChecks();
    this.servers.clear();
  }
}

