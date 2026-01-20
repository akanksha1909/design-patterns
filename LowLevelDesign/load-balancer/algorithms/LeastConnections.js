import { LoadBalancingAlgorithm } from './LoadBalancingAlgorithm.js';

/**
 * Least Connections algorithm - selects server with fewest active connections
 */
export class LeastConnections extends LoadBalancingAlgorithm {
  constructor() {
    super('LeastConnections');
  }

  selectServer(servers) {
    if (!servers || servers.length === 0) {
      return null;
    }

    const healthyServers = servers.filter(server => server.isHealthy);
    if (healthyServers.length === 0) {
      return null;
    }

    // Find server with minimum active connections
    return healthyServers.reduce((min, server) => 
      server.activeConnections < min.activeConnections ? server : min
    );
  }
}

