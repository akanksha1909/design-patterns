import { LoadBalancingAlgorithm } from './LoadBalancingAlgorithm.js';

/**
 * Round Robin algorithm - distributes requests evenly in circular order
 */
export class RoundRobin extends LoadBalancingAlgorithm {
  constructor() {
    super('RoundRobin');
    this.currentIndex = 0;
  }

  selectServer(servers) {
    if (!servers || servers.length === 0) {
      return null;
    }

    const healthyServers = servers.filter(server => server.isHealthy);
    if (healthyServers.length === 0) {
      return null;
    }

    // Sort by ID to ensure consistent order
    healthyServers.sort((a, b) => a.id.localeCompare(b.id));

    const server = healthyServers[this.currentIndex % healthyServers.length];
    this.currentIndex = (this.currentIndex + 1) % healthyServers.length;
    return server;
  }

  reset() {
    this.currentIndex = 0;
  }
}

