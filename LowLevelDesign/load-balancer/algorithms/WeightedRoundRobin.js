import { LoadBalancingAlgorithm } from './LoadBalancingAlgorithm.js';

/**
 * Weighted Round Robin algorithm - distributes requests based on server weights
 */
export class WeightedRoundRobin extends LoadBalancingAlgorithm {
  constructor() {
    super('WeightedRoundRobin');
    this.currentWeight = 0;
    this.currentIndex = -1;
  }

  selectServer(servers) {
    if (!servers || servers.length === 0) {
      return null;
    }

    const healthyServers = servers.filter(server => server.isHealthy);
    if (healthyServers.length === 0) {
      return null;
    }

    // Calculate total weight
    const totalWeight = healthyServers.reduce((sum, server) => sum + server.weight, 0);
    if (totalWeight === 0) {
      return healthyServers[0];
    }

    // Weighted round robin selection
    while (true) {
      this.currentIndex = (this.currentIndex + 1) % healthyServers.length;
      if (this.currentIndex === 0) {
        this.currentWeight = this.currentWeight - 1;
        if (this.currentWeight <= 0) {
          this.currentWeight = Math.max(...healthyServers.map(s => s.weight));
        }
      }
      
      if (healthyServers[this.currentIndex].weight >= this.currentWeight) {
        return healthyServers[this.currentIndex];
      }
    }
  }

  reset() {
    this.currentWeight = 0;
    this.currentIndex = -1;
  }
}

