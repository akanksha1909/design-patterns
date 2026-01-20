import express from 'express';

function healthRoutes(loadBalancer: any) {
    const router = express.Router();
    // router.post("/check", async (req, res) => {
    //     await loadBalancer.performHealthChecks();
    //     const servers = Array.from(loadBalancer.servers.values());
    //     const healthStatuses = servers.map(server => ({
    //         id: server.id,
    //         url: server.url,
    //         healthy: server.isHealthy,
    //         lastResponseTime: server.responseTime
    //     }));
    //     res.json({ servers: healthStatuses });
    // });
    return router;
}


export default healthRoutes;