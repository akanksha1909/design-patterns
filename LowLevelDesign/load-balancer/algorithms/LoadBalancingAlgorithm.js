/**
 * Abstract base class for load balancing algorithms
 * This allows for extensibility - new algorithms can be added easily
 */
export class LoadBalancingAlgorithm {
  constructor(name) {
    this.name = name;
  }

  /**
   * Select the next server from the pool
   * @param {BackendServer[]} servers - Array of healthy backend servers
   * @returns {BackendServer|null} - Selected server or null if no healthy servers
   */
  selectServer(servers) {
    throw new Error('selectServer must be implemented by subclass');
  }

  /**
   * Get algorithm name
   */
  getName() {
    return this.name;
  }
}

