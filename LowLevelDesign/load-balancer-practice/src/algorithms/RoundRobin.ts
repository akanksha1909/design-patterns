import { BackendServer } from "../BackendServer.js";

export class RoundRobin {
    private currentIndex: number;

    constructor() {
        this.currentIndex = -1;
    }

    selectServer(servers: BackendServer[]): BackendServer | null {
        // Consider servers available if:
        // 1. isHealthy is true, OR
        // 2. Health check hasn't been performed yet (lastHealthCheck is null), OR
        // 3. Health check failed but was recent (within last 30 seconds - grace period)
        const now = Date.now();
        const GRACE_PERIOD = 30000; // 30 seconds
        
        const availableServers = servers.filter(server => {
            if (server.isHealthy === true) return true;
            if (server.lastHealthCheck === null) return true;
            // Allow server if health check failed recently (grace period)
            if (!server.isHealthy && server.lastHealthCheck && (now - server.lastHealthCheck) < GRACE_PERIOD) {
                return true;
            }
            return false;
        });
        
        if (availableServers.length === 0) {
            return null;
        }

        this.currentIndex = (this.currentIndex + 1) % availableServers.length;
        return availableServers[this.currentIndex];
    }
}