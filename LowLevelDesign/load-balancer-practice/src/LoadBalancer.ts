import { BackendServer } from "./BackendServer.js";
import { RoundRobin } from './algorithms/RoundRobin.js';
import WeightedRoundRobin from './algorithms/WeightedRoundRobin.js'
import axios from 'axios';

interface LoadBalancerOptions {
    algorithm?: string | any;
    timeout?: number;
    healthCheckInterval?: number;
    healthCheckTimeout?: number;
    healthCheckEnabled?: boolean;
}

export interface ForwardResponse {
    status: number;
    data: any;
    headers: Record<string, string>;
    serverId: string;
    serverUrl: string;
}

export class LoadBalancer {
    public servers: Map<string, BackendServer>
    public algorithm: any
    public timeout: number
    public healthCheckInterval: number
    public healthCheckTimeout: number
    public healthCheckEnabled: boolean
    private availableAlgorithms: { [key: string]: any }
    private healthCheckTimer: NodeJS.Timeout | null
    constructor(options: LoadBalancerOptions = {}) {
        this.servers = new Map();

        this.availableAlgorithms = {
            'round-robin': RoundRobin,
            'weighted-round-robin': WeightedRoundRobin,
            // 'least-connections': LeastConnections,
            // 'random': Random
        };

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

    startHealthChecks() {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }
        this.healthCheckTimer = setInterval(() => {
            this.performHealthChecks();

        }, this.healthCheckInterval);
    }

    async performHealthChecks() {
        const servers = Array.from(this.servers.values());
        const healthCheckPromises = servers.map(server => this.checkServerHealth(server))
        await Promise.all(healthCheckPromises);
    }

    async checkServerHealth(server: BackendServer) {
        try {
            const startTime = Date.now();
            const response = await axios.get(`${server.url}${server.healthCheckPath}`, {
                timeout: this.healthCheckTimeout,
                validateStatus: () => true
            })
            const responseTime = Date.now() - startTime;
            const isHealthy = response.status >= 200 && response.status < 300
            server.updateHealth(isHealthy, responseTime)
        } catch (error) {
            server.updateHealth(false)
        }

    }

    addServer(id, url, weight = 1, healthCheckPath = '/health', skipInitialHealthCheck = false) {
        if (this.servers.has(id)) {
            throw new Error(`Server with id ${id} already exists`);
        }

        const server = new BackendServer(id, url, weight, healthCheckPath);
        this.servers.set(id, server);

        // Perform initial health check (non-blocking, won't mark server as unavailable if it fails)
        if (this.healthCheckEnabled && !skipInitialHealthCheck) {
            // Don't await - let it run in background, server starts as healthy
            this.checkServerHealth(server).catch(() => {
                // Silently fail initial health check - server remains available
            });
        }

        return server;
    }

    selectServer() {
        const servers = Array.from(this.servers.values());
        
        if (servers.length === 0) {
            return null;
        }
        
        return this.algorithm.selectServer(servers);
    }


    // @ts-ignore
   async forwardRequest(method, path, headers = {}, body = null, query = {}): Promise<ForwardResponse> {
    const totalServers = this.servers.size;
    const server = this.selectServer();
    
    if (!server) {
      if (totalServers === 0) {
        throw new Error('No servers registered. Please add backend servers first.');
      } else {
        throw new Error('No healthy servers available');
      }
    }

    try {
    //   server.incrementConnections();

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
        // @ts-ignore
        config.data = body;
      }

      const startTime = Date.now();
      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      return {
        status: response.status,
        // @ts-ignore
        headers: response.headers,
        data: response.data,
        serverId: server.id,
        serverUrl: server.url
      };
    } catch (error) {
      // Mark server as unhealthy on timeout or connection error
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        server.updateHealth(false);
      }
      throw error;
    } finally {
    //   server.decrementConnections();
    }
  }
}