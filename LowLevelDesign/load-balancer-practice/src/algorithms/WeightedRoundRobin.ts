import { BackendServer } from "../BackendServer.js";

class WeightedRoundRobin {
    private currentIndex: number;
    private currentWeight: number;
    
    constructor() {
        this.currentIndex = -1;
        this.currentWeight = 0;
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

        // Find max weight
        const maxWeight = Math.max(...availableServers.map(s => s.weight || 1));

        while(true) {
            this.currentIndex = (this.currentIndex + 1) % availableServers.length;
            
            if(this.currentIndex === 0) {
                this.currentWeight -= 1;
                if(this.currentWeight <= 0) {
                    this.currentWeight = maxWeight;
                }
            }

            const server = availableServers[this.currentIndex];
            if((server.weight || 1) >= this.currentWeight) {
                return server;
            }
        }
    }
}

export default WeightedRoundRobin;