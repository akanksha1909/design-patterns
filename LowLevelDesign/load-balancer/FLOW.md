# Load Balancer Project Flow

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Client    │
│  (Browser/  │
│   API)      │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────────────────────────────────┐
│         Load Balancer (Port 3000)                │
│  ┌──────────────────────────────────────────┐   │
│  │         Express Server (index.js)         │   │
│  └──────────────────────────────────────────┘   │
│                    │                             │
│        ┌───────────┴───────────┐                 │
│        │                       │                 │
│   ┌────▼────┐          ┌──────▼──────┐          │
│   │ Config  │          │   Health    │          │
│   │ Routes  │          │   Routes    │          │
│   │         │          │             │          │
│   │ /api/   │          │ /api/       │          │
│   │ config  │          │ health      │          │
│   └─────────┘          └─────────────┘          │
│        │                       │                 │
│        └───────────┬───────────┘                 │
│                    │                             │
│           ┌────────▼────────┐                    │
│           │  Load Balancer  │                    │
│           │    Core Class   │                    │
│           │                 │                    │
│           │  - Server Pool  │                    │
│           │  - Algorithm    │                    │
│           │  - Health Check │                    │
│           └────────┬────────┘                    │
└────────────────────┼────────────────────────────┘
                     │
                     │ Select Server
                     │ Forward Request
                     ▼
        ┌────────────┴────────────┐
        │                         │
   ┌────▼────┐              ┌─────▼─────┐
   │Server 1 │              │ Server 2  │
   │:3001    │              │ :3002     │
   └─────────┘              └───────────┘
```

## 📊 Request Flow

### Flow 1: Configuration Request (Not Load Balanced)

```
Client Request
    │
    │ POST /api/config/servers
    ▼
Express Router (index.js)
    │
    │ Route: /api/config/*
    ▼
Config Routes (routes/config.js)
    │
    │ Calls loadBalancer.addServer()
    ▼
LoadBalancer Class
    │
    │ Creates BackendServer instance
    │ Performs initial health check
    ▼
BackendServer Pool (Map<id, BackendServer>)
    │
    │ Returns server status
    ▼
Response to Client
```

### Flow 2: Load Balanced Request

```
Client Request
    │
    │ GET /api/users (or any route except /api/config/*, /api/health/*)
    ▼
Express Router (index.js)
    │
    │ Route: app.all('*')
    │ Extracts: method, path, headers, body, query
    ▼
LoadBalancer.forwardRequest()
    │
    │ Step 1: Select Server
    │   └─► loadBalancer.selectServer()
    │       │
    │       │ Get all servers from pool
    │       ▼
    │   Algorithm.selectServer(servers)
    │       │
    │       │ Filter healthy servers
    │       │ Apply algorithm logic
    │       │ (Round Robin / Least Connections / etc.)
    │       ▼
    │   Returns: Selected BackendServer
    │
    │ Step 2: Forward Request
    │   └─► server.incrementConnections()
    │   └─► axios.request() to backend server
    │       │
    │       │ HTTP Request to: http://localhost:3001/api/users
    │       │ Headers: X-Forwarded-By, X-Backend-Server
    │       │ Timeout: 5000ms
    │       ▼
    │   Backend Server (mock-backend-server.js)
    │       │
    │       │ Processes request
    │       │ Returns response
    │       ▼
    │   Response received
    │
    │ Step 3: Update Metrics
    │   └─► server.decrementConnections()
    │   └─► Calculate response time
    │
    ▼
Response to Client
    │
    │ Status: 200
    │ Headers: (copied from backend)
    │ Body: {
    │   ...backendData,
    │   _metadata: {
    │     serverId: "server1",
    │     serverUrl: "http://localhost:3001",
    │     responseTime: 67,
    │     loadBalanced: true
    │   }
    │ }
    ▼
Client receives response
```

## 🔄 Health Check Flow

```
┌─────────────────────────────────────────┐
│  Health Check Timer (Every 10 seconds)  │
└───────────────┬─────────────────────────┘
                │
                ▼
    LoadBalancer.performHealthChecks()
                │
                │ For each server in pool
                ▼
    ┌───────────────────────────┐
    │  checkServerHealth(server)  │
    └───────────┬───────────────┘
                │
                │ GET http://server.url/health
                │ Timeout: 3000ms
                ▼
        ┌───────────────┐
        │ Backend Server│
        │ Health Endpoint│
        └───────┬───────┘
                │
                │ Response (200 OK or error)
                ▼
    server.updateHealth(isHealthy, responseTime)
                │
                │ Updates:
                │ - isHealthy flag
                │ - lastHealthCheck timestamp
                │ - responseTime
                ▼
    Health status updated in BackendServer
```

## 🎯 Algorithm Selection Flow

```
Request arrives
    │
    ▼
LoadBalancer.selectServer()
    │
    │ Get all servers: Array.from(this.servers.values())
    ▼
Algorithm.selectServer(servers)
    │
    │ Filter: servers.filter(server => server.isHealthy)
    │
    ├─► Round Robin:
    │   └─► Sort by ID (consistent order)
    │   └─► Select: healthyServers[currentIndex % length]
    │   └─► Increment: currentIndex++
    │
    ├─► Least Connections:
    │   └─► Find: min(server.activeConnections)
    │
    ├─► Weighted Round Robin:
    │   └─► Calculate total weight
    │   └─► Select based on weight distribution
    │
    └─► Random:
        └─► Select: healthyServers[randomIndex]
    │
    ▼
Return selected BackendServer
```

## 🚨 Error Handling Flow

```
Request Forwarding
    │
    ├─► No healthy servers available
    │   └─► Error: "No healthy servers available"
    │   └─► Response: 503 Service Unavailable
    │
    ├─► Connection refused (ECONNREFUSED)
    │   └─► Mark server as unhealthy
    │   └─► Response: 502 Bad Gateway
    │
    ├─► Request timeout (ETIMEDOUT)
    │   └─► Mark server as unhealthy
    │   └─► Response: 504 Gateway Timeout
    │
    └─► Other errors
        └─► Response: 500 Internal Server Error
```

## 📦 Component Interactions

### 1. **index.js** (Entry Point)
- Initializes Express server
- Sets up middleware (CORS, JSON parsing)
- Creates LoadBalancer instance
- Registers routes:
  - `/api/config/*` → Config routes
  - `/api/health/*` → Health routes
  - `*` → Load balanced routes (catch-all)

### 2. **LoadBalancer.js** (Core Logic)
- Manages server pool (Map<id, BackendServer>)
- Implements load balancing algorithms
- Handles health checks
- Forwards requests to backend servers
- Tracks metrics (connections, requests, response times)

### 3. **BackendServer.js** (Server Model)
- Represents a single backend server
- Tracks:
  - Health status
  - Active connections
  - Total requests
  - Response times
  - Weight

### 4. **Algorithms/** (Strategy Pattern)
- Base class: `LoadBalancingAlgorithm`
- Implementations:
  - `RoundRobin`
  - `LeastConnections`
  - `WeightedRoundRobin`
  - `Random`

### 5. **routes/config.js** (Configuration API)
- GET/POST/PUT/DELETE `/api/config/servers`
- PUT `/api/config/timeout`
- PUT/GET `/api/config/algorithm`
- GET `/api/config/stats`
- GET `/api/config/requests`

### 6. **routes/health.js** (Health Check API)
- GET `/api/health`
- POST `/api/health/check`
- GET `/api/health/servers`

## 🔄 Complete Request Lifecycle Example

```
1. Client: GET http://localhost:3000/api/users
   │
2. Express receives request
   │
3. Route matching: app.all('*') matches
   │
4. LoadBalancer.forwardRequest('GET', '/api/users', ...)
   │
5. LoadBalancer.selectServer()
   │   ├─► Get all servers: [server1, server2]
   │   ├─► Filter healthy: [server1, server2]
   │   ├─► Algorithm: RoundRobin
   │   ├─► Sort: [server1, server2] (by ID)
   │   ├─► Select: server1 (currentIndex = 0)
   │   └─► Increment: currentIndex = 1
   │
6. server1.incrementConnections()
   │   ├─► activeConnections: 0 → 1
   │   └─► totalRequests: 10 → 11
   │
7. axios.get('http://localhost:3001/api/users')
   │   ├─► Headers: X-Forwarded-By, X-Backend-Server
   │   ├─► Timeout: 5000ms
   │   └─► Wait for response...
   │
8. Backend Server (port 3001) processes request
   │   ├─► Logs: "server1 → GET /api/users"
   │   ├─► Processes: delay(0-100ms)
   │   └─► Returns: { success: true, data: [...] }
   │
9. Response received (200 OK, 67ms)
   │
10. server1.decrementConnections()
    │   └─► activeConnections: 1 → 0
    │
11. LoadBalancer returns result
    │   └─► { status: 200, data: {...}, serverId: "server1", ... }
    │
12. Express formats response
    │   └─► Adds _metadata with server info
    │
13. Client receives response
    │   └─► { data: [...], _metadata: { serverId: "server1", ... } }
    │
14. Log: "[timestamp] GET /api/users → server1 (http://localhost:3001) [67ms]"
```

## 🎛️ Dynamic Configuration Flow

```
Configuration Change Request
    │
    │ Example: PUT /api/config/algorithm
    │ Body: { "algorithm": "least-connections" }
    ▼
Config Routes (routes/config.js)
    │
    │ loadBalancer.setAlgorithm('least-connections')
    ▼
LoadBalancer.setAlgorithm()
    │
    │ Lookup: availableAlgorithms['least-connections']
    │ Create: new LeastConnections()
    │ Assign: this.algorithm = new instance
    ▼
Algorithm changed (takes effect immediately)
    │
    │ Next request will use LeastConnections
    ▼
Response: { success: true, algorithm: "LeastConnections" }
```

## 🔍 Key Design Patterns Used

1. **Strategy Pattern**: Load balancing algorithms are interchangeable
2. **Singleton-like**: One LoadBalancer instance manages all servers
3. **Observer Pattern**: Health checks monitor server status
4. **Proxy Pattern**: Load balancer acts as proxy to backend servers
5. **Factory Pattern**: Algorithm instances created dynamically

## 📈 Metrics & Monitoring

- **Per Server**:
  - Total requests
  - Active connections
  - Health status
  - Response times
  - Last health check time

- **Load Balancer**:
  - Total servers
  - Healthy servers
  - Current algorithm
  - Request timeout
  - Health check interval

