# Timeout Concept in Load Balancer

## Overview

The load balancer uses **two types of timeouts** to ensure reliability and prevent hanging requests:

1. **Request Timeout** - For client requests forwarded to backend servers
2. **Health Check Timeout** - For periodic health check requests

---

## 1. Request Timeout (`timeout`)

### What it is:
The maximum time (in milliseconds) the load balancer will wait for a backend server to respond to a forwarded request.

### Default Value:
```javascript
timeout: 5000  // 5 seconds
```

### Where it's used:
```javascript
// In LoadBalancer.forwardRequest()
const config = {
  method,
  url,
  headers: {...},
  params: query,
  timeout: this.timeout,  // ← Applied here
  validateStatus: () => true
};

const response = await axios(config);
```

### How it works:

```
Client Request
    │
    │ Forwarded to Backend Server
    ▼
┌─────────────────────────────────────┐
│  Wait for Response                  │
│                                     │
│  ⏱️  Timeout: 5000ms (5 seconds)    │
│                                     │
│  If response received within 5s:    │
│    ✅ Return response to client     │
│                                     │
│  If no response after 5s:           │
│    ❌ Timeout error                 │
│    ❌ Mark server as unhealthy     │
│    ❌ Return 504 Gateway Timeout    │
└─────────────────────────────────────┘
```

### Example Scenarios:

**Scenario 1: Fast Response (Success)**
```
Request sent → Backend responds in 200ms → ✅ Success
```

**Scenario 2: Slow Response (Success)**
```
Request sent → Backend responds in 4500ms → ✅ Success (within timeout)
```

**Scenario 3: Timeout (Failure)**
```
Request sent → No response after 5000ms → ❌ Timeout
→ Server marked as unhealthy
→ Client receives 504 Gateway Timeout
```

### Why it's important:

1. **Prevents Hanging Requests**: Without timeout, a slow/unresponsive server could make clients wait indefinitely
2. **Fast Failure**: Quickly identifies problematic servers
3. **Automatic Failover**: Unhealthy servers are automatically excluded from load balancing
4. **Better User Experience**: Clients get error responses quickly instead of waiting forever

### How to configure:

**At initialization:**
```javascript
const loadBalancer = new LoadBalancer({
  timeout: 10000  // 10 seconds
});
```

**Dynamically via API:**
```bash
curl -X PUT http://localhost:3000/api/config/timeout \
  -H "Content-Type: application/json" \
  -d '{"timeout": 10000}'
```

**Get current timeout:**
```bash
curl http://localhost:3000/api/config/timeout
```

---

## 2. Health Check Timeout (`healthCheckTimeout`)

### What it is:
The maximum time (in milliseconds) the load balancer will wait for a backend server to respond to a health check request.

### Default Value:
```javascript
healthCheckTimeout: 3000  // 3 seconds
```

### Where it's used:
```javascript
// In LoadBalancer.checkServerHealth()
const response = await axios.get(`${server.url}${server.healthCheckPath}`, {
  timeout: this.healthCheckTimeout,  // ← Applied here
  validateStatus: () => true
});
```

### How it works:

```
Health Check Timer (Every 10 seconds)
    │
    │ GET /health to each server
    ▼
┌─────────────────────────────────────┐
│  Wait for Health Check Response     │
│                                     │
│  ⏱️  Timeout: 3000ms (3 seconds)    │
│                                     │
│  If response received within 3s:    │
│    ✅ Mark server as healthy        │
│                                     │
│  If no response after 3s:           │
│    ❌ Timeout error                 │
│    ❌ Mark server as unhealthy     │
│    ❌ Exclude from load balancing   │
└─────────────────────────────────────┘
```

### Why it's different from Request Timeout:

1. **Shorter Duration**: Health checks should be quick (3s vs 5s)
2. **Different Purpose**: Health checks are internal, not user-facing
3. **More Frequent**: Health checks run every 10 seconds, so they need to be fast
4. **Fail Fast**: If a server can't respond to a health check in 3 seconds, it's likely having issues

### Example:

```
Time: 0s    → Health check sent to server1
Time: 0.1s  → server1 responds: 200 OK
             → ✅ Marked as healthy

Time: 0s    → Health check sent to server2
Time: 3.1s  → No response (timeout)
             → ❌ Marked as unhealthy
             → ❌ Excluded from load balancing
```

---

## Timeout Error Handling

### Request Timeout Errors:

When a request times out, the load balancer:

1. **Catches the timeout error:**
```javascript
catch (error) {
  if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
    server.updateHealth(false);  // Mark as unhealthy
  }
  throw error;
}
```

2. **Returns appropriate HTTP status:**
```javascript
// In index.js
if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
  res.status(504).json({
    success: false,
    error: 'Request timeout',
    message: 'Backend server did not respond in time'
  });
}
```

### Health Check Timeout Errors:

When a health check times out:

1. **Server marked as unhealthy:**
```javascript
catch (error) {
  server.updateHealth(false);  // Silent failure, just mark unhealthy
}
```

2. **Server excluded from selection:**
```javascript
// In algorithm selection
const healthyServers = servers.filter(server => server.isHealthy);
// Unhealthy servers are automatically filtered out
```

---

## Configuration Summary

| Timeout Type | Default | Purpose | Configurable |
|-------------|---------|---------|--------------|
| **Request Timeout** | 5000ms (5s) | Maximum wait time for backend server response | ✅ Yes (via API) |
| **Health Check Timeout** | 3000ms (3s) | Maximum wait time for health check response | ❌ No (set at initialization) |
| **Health Check Interval** | 10000ms (10s) | How often to check server health | ❌ No (set at initialization) |

---

## Best Practices

### Request Timeout:
- **Too Short (< 2s)**: May timeout on legitimate slow requests
- **Too Long (> 10s)**: Clients wait too long for failures
- **Recommended**: 5-10 seconds for most applications

### Health Check Timeout:
- **Too Short (< 1s)**: May mark healthy servers as unhealthy during brief network hiccups
- **Too Long (> 5s)**: Slow to detect server failures
- **Recommended**: 2-3 seconds (should be faster than request timeout)

### Relationship:
```
Health Check Timeout < Request Timeout
(3s)                 < (5s)
```

This ensures:
- Health checks fail fast
- Request timeouts give more time for actual requests
- Unhealthy servers are detected quickly

---

## Real-World Example

```javascript
// Scenario: Backend server is overloaded

Request 1:
  → Forwarded to server1
  → Server processing (takes 6 seconds)
  → ⏱️  Timeout after 5 seconds
  → ❌ 504 Gateway Timeout returned to client
  → server1 marked as unhealthy

Health Check (runs every 10s):
  → GET /health to server1
  → ⏱️  Timeout after 3 seconds
  → ❌ server1 remains unhealthy
  → ❌ server1 excluded from load balancing

Next Request:
  → Only server2 is healthy
  → Request goes to server2
  → ✅ Success
```

---

## Code References

- **Request Timeout**: `LoadBalancer.js` line 182
- **Health Check Timeout**: `LoadBalancer.js` line 220
- **Timeout Configuration**: `LoadBalancer.js` lines 36, 137-141
- **Error Handling**: `LoadBalancer.js` lines 202-207, `index.js` lines 79-84


