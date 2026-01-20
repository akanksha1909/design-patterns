/**
 * Represents a backend server in the load balancer pool
 */
export class BackendServer {
  constructor(id, url, weight = 1, healthCheckPath = '/health') {
    this.id = id;
    this.url = url;
    this.weight = weight;
    this.healthCheckPath = healthCheckPath;
    this.isHealthy = true;
    this.activeConnections = 0;
    this.totalRequests = 0;
    this.lastHealthCheck = null;
    this.responseTime = null;
  }

  /**
   * Increment active connections
   */
  incrementConnections() {
    this.activeConnections++;
    this.totalRequests++;
  }

  /**
   * Decrement active connections
   */
  decrementConnections() {
    if (this.activeConnections > 0) {
      this.activeConnections--;
    }
  }

  /**
   * Update health status
   */
  updateHealth(isHealthy, responseTime = null) {
    this.isHealthy = isHealthy;
    this.lastHealthCheck = new Date();
    if (responseTime !== null) {
      this.responseTime = responseTime;
    }
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      id: this.id,
      url: this.url,
      weight: this.weight,
      isHealthy: this.isHealthy,
      activeConnections: this.activeConnections,
      totalRequests: this.totalRequests,
      lastHealthCheck: this.lastHealthCheck,
      responseTime: this.responseTime
    };
  }
}

