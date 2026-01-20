import { LoadBalancingAlgorithm } from './LoadBalancingAlgorithm.js';

/**
 * Random algorithm - selects a random healthy server
 */
export class Random extends LoadBalancingAlgorithm {
  constructor() {
    super('Random');
  }

  selectServer(servers) {
    if (!servers || servers.length === 0) {
      return null;
    }

    const healthyServers = servers.filter(server => server.isHealthy);
    if (healthyServers.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * healthyServers.length);
    return healthyServers[randomIndex];
  }
}

