# Load Balancer

A fully functional, extensible Load Balancer built with Node.js and Express. This implementation supports dynamic configuration changes, multiple load balancing algorithms, health checks, and automatic failover.

## Features

- ✅ **Multiple Load Balancing Algorithms**
  - Round Robin
  - Least Connections
  - Weighted Round Robin
  - Random
  - Extensible architecture for adding new algorithms

- ✅ **Dynamic Configuration**
  - Add/Remove backend servers at runtime
  - Update server configurations (URL, weight, health check path)
  - Change load balancing algorithm dynamically
  - Update request timeout settings

- ✅ **Health Check System**
  - Automatic periodic health checks
  - Manual health check triggers
  - Server health status tracking
  - Automatic failover for unhealthy servers

- ✅ **RESTful API**
  - Configuration management endpoints
  - Health check endpoints
  - All other routes are load balanced

- ✅ **Statistics & Monitoring**
  - Server status and metrics
  - Request counts and active connections
  - Response time tracking

## Installation

```bash
npm install
```

## Usage

### 1. Start the Load Balancer

```bash
npm start
```

The load balancer will start on `http://localhost:3000`

### 2. Start Mock Backend Servers

In separate terminal windows, start multiple mock backend servers:

```bash
# Terminal 1
PORT=3001 SERVER_ID=server1 node mock-backend-server.js

# Terminal 2
PORT=3002 SERVER_ID=server2 node mock-backend-server.js

# Terminal 3
PORT=3003 SERVER_ID=server3 node mock-backend-server.js
```

### 3. Add Backend Servers to Load Balancer

```bash
# Add server 1
curl -X POST http://localhost:3000/api/config/servers \
  -H "Content-Type: application/json" \
  -d '{"id": "server1", "url": "http://localhost:3001", "weight": 1}'

# Add server 2
curl -X POST http://localhost:3000/api/config/servers \
  -H "Content-Type: application/json" \
  -d '{"id": "server1", "url": "http://localhost:3001", "weight": 1}'

# Add server 3
curl -X POST http://localhost:3000/api/config/servers \
  -H "Content-Type: application/json" \
  -d '{"id": "server3", "url": "http://localhost:3003", "weight": 1}'
```

### 4. Test Load Balancing

```bash
# Make requests - they will be load balanced across servers
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users
```

## API Endpoints

### Configuration Endpoints

#### Get All Servers
```bash
GET /api/config/servers
```

#### Get Specific Server
```bash
GET /api/config/servers/:id
```

#### Add Server
```bash
POST /api/config/servers
Content-Type: application/json

{
  "id": "server1",
  "url": "http://localhost:3001",
  "weight": 1,
  "healthCheckPath": "/health"
}
```

#### Update Server
```bash
PUT /api/config/servers/:id
Content-Type: application/json

{
  "url": "http://localhost:3001",
  "weight": 2
}
```

#### Remove Server
```bash
DELETE /api/config/servers/:id
```

#### Update Timeout
```bash
PUT /api/config/timeout
Content-Type: application/json

{
  "timeout": 10000
}
```

#### Get Timeout
```bash
GET /api/config/timeout
```

#### Change Algorithm
```bash
PUT /api/config/algorithm
Content-Type: application/json

{
  "algorithm": "least-connections"
}
```

Available algorithms:
- `round-robin`
- `least-connections`
- `weighted-round-robin`
- `random`

#### Get Current Algorithm
```bash
GET /api/config/algorithm
```

#### Get Statistics
```bash
GET /api/config/stats
```

#### Get Request Distribution
```bash
GET /api/config/requests
```

Returns detailed request distribution showing how many requests each server has received, including:
- Total requests per server
- Percentage of total requests
- Active connections
- Server health status
- Response times

Example response:
```json
{
  "success": true,
  "data": {
    "totalRequests": 100,
    "algorithm": "round-robin",
    "servers": [
      {
        "id": "server2",
        "url": "http://localhost:3002",
        "weight": 2,
        "isHealthy": true,
        "totalRequests": 50,
        "activeConnections": 2,
        "percentage": "50.00%",
        "lastHealthCheck": "2024-01-15T10:30:00.000Z",
        "responseTime": 45
      },
      {
        "id": "server1",
        "url": "http://localhost:3001",
        "weight": 1,
        "isHealthy": true,
        "totalRequests": 25,
        "activeConnections": 1,
        "percentage": "25.00%",
        "lastHealthCheck": "2024-01-15T10:30:00.000Z",
        "responseTime": 42
      }
    ]
  }
}
```

### Health Check Endpoints

#### Load Balancer Health
```bash
GET /api/health
```

#### Manual Health Check
```bash
POST /api/health/check
```

#### Get All Servers Health Status
```bash
GET /api/health/servers
```

### Load Balanced Routes

All other routes (except `/api/config/*` and `/api/health/*`) are automatically load balanced:

```bash
# These requests will be forwarded to backend servers
GET /api/users
GET /api/products
POST /api/users
# ... any other route
```

## Architecture

### Core Components

1. **LoadBalancer** (`LoadBalancer.js`)
   - Main orchestrator
   - Manages server pool
   - Handles request forwarding
   - Manages health checks

2. **BackendServer** (`BackendServer.js`)
   - Represents a backend server
   - Tracks health, connections, metrics

3. **Load Balancing Algorithms** (`algorithms/`)
   - Base class: `LoadBalancingAlgorithm.js`
   - Implementations: `RoundRobin.js`, `LeastConnections.js`, `WeightedRoundRobin.js`, `Random.js`
   - Easy to extend with new algorithms

4. **Routes** (`routes/`)
   - `config.js`: Configuration management
   - `health.js`: Health check endpoints

### Extensibility

#### Adding a New Load Balancing Algorithm

1. Create a new file in `algorithms/` directory:

```javascript
import { LoadBalancingAlgorithm } from './LoadBalancingAlgorithm.js';

export class CustomAlgorithm extends LoadBalancingAlgorithm {
  constructor() {
    super('CustomAlgorithm');
  }

  selectServer(servers) {
    // Your algorithm logic here
    const healthyServers = servers.filter(s => s.isHealthy);
    if (healthyServers.length === 0) return null;
    
    // Return selected server
    return healthyServers[0];
  }
}
```

2. Register it in `LoadBalancer.js`:

```javascript
this.availableAlgorithms = {
  // ... existing algorithms
  'custom': CustomAlgorithm
};
```

#### Dynamic Configuration

All configuration changes are applied immediately without restart:
- Adding/removing servers
- Changing algorithms
- Updating timeouts
- Server configuration updates

## Example Workflow

1. Start load balancer and mock servers
2. Add backend servers via config API
3. Make requests to any route (except config/health)
4. Requests are automatically load balanced
5. Monitor health and statistics
6. Dynamically change algorithm or server configuration
7. Add/remove servers as needed

## Error Handling

- **503 Service Unavailable**: No healthy servers available
- **502 Bad Gateway**: Backend server connection refused
- **504 Gateway Timeout**: Request timeout exceeded
- **500 Internal Server Error**: Other errors

## Notes

- Health checks run automatically every 10 seconds (configurable)
- Only healthy servers are selected for load balancing
- Unhealthy servers are automatically excluded
- Server health is rechecked periodically
- Request timeouts are configurable per request

## License

ISC

