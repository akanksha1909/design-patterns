export class BackendServer {
    isHealthy: boolean;
    lastHealthCheck: number | null;
    responseTime: number | null;
    id: string;
    url: string;
    healthCheckPath: string;
    weight: number | undefined;
    activeConnections: number;
    totalRequests: number;
    constructor(id: string, url: string, weight: number = 1, healthCheckPath: string = '/health') {
        this.id = id;
        this.url = url;
        this.weight = weight;
        this.healthCheckPath = healthCheckPath;
        this.isHealthy = true;
        this.lastHealthCheck = null;
        this.responseTime = null;
        this.activeConnections = 0;
        this.totalRequests = 0;
    }

    updateHealth(isHealthy: boolean, responseTime?: number) {
        this.isHealthy = isHealthy;
        this.lastHealthCheck = Date.now();
        if (responseTime != null) {
            this.responseTime = responseTime;
        }
    }
}