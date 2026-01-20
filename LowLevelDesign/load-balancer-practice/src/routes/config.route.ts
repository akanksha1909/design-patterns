import express from 'express';

function configRoutes(loadBalancer: any) {
    const router = express.Router();

    // router.get("/servers", (req, res) => {
    //     const servers = Array.from(loadBalancer.servers.values());
    //     const serverList = servers.map(server => ({
    //         id: server.id,
    //         url: server.url,
    //         weight: server.weight,
    //         isHealthy: server.isHealthy,
    //         lastHealthCheck: server.lastHealthCheck,
    //         responseTime: server.responseTime,
    //         healthCheckPath: server.healthCheckPath
    //     }));
    //     res.json({ 
    //         servers: serverList,
    //         total: serverList.length,
    //         healthy: serverList.filter(s => s.isHealthy).length
    //     });
    // });

    router.post("/servers", (req, res) => {
        const { id, url, weight, healthCheckPath, skipHealthCheck } = req.body;
        if (!id || !url) {
            return res.status(400).json({ error: "Missing required fields: id, url" });
        }
        try {
            loadBalancer.addServer(id, url, weight || 1, healthCheckPath || '/health', skipHealthCheck || false);
            res.status(201).json({ message: "Server added successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });
    return router;
}

export default configRoutes;