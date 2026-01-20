# VCS API Usage Examples

## Using curl

### 1. Initialize Repository
```bash
curl -X POST http://localhost:3000/api/vcs/init
```

### 2. Add Files to Staging
```bash
# Add all JavaScript files
curl -X POST http://localhost:3000/api/vcs/add \
  -H "Content-Type: application/json" \
  -d '{"pattern": ".*\\.js$"}'

# Add all files
curl -X POST http://localhost:3000/api/vcs/add \
  -H "Content-Type: application/json" \
  -d '{"pattern": ".*"}'

# Add specific file pattern
curl -X POST http://localhost:3000/api/vcs/add \
  -H "Content-Type: application/json" \
  -d '{"pattern": "src/.*"}'
```

### 3. Commit Changes
```bash
# Regular commit
curl -X POST http://localhost:3000/api/vcs/commit \
  -H "Content-Type: application/json" \
  -d '{"message": "Initial commit"}'

# Add and commit (equivalent to -am flag)
curl -X POST http://localhost:3000/api/vcs/commit \
  -H "Content-Type: application/json" \
  -d '{"message": "Quick commit", "all": true}'
```

### 4. Checkout Branch
```bash
# Switch to existing branch
curl -X POST http://localhost:3000/api/vcs/checkout \
  -H "Content-Type: application/json" \
  -d '{"branch": "main"}'

# Create and switch to new branch (equivalent to -b flag)
curl -X POST http://localhost:3000/api/vcs/checkout \
  -H "Content-Type: application/json" \
  -d '{"branch": "feature", "create": true}'
```

### 5. Reset HEAD
```bash
# Reset to HEAD~1
curl -X POST http://localhost:3000/api/vcs/reset \
  -H "Content-Type: application/json" \
  -d '{"offset": 1}'

# Reset to HEAD~3
curl -X POST http://localhost:3000/api/vcs/reset \
  -H "Content-Type: application/json" \
  -d '{"offset": 3}'
```

### 6. Get Status
```bash
curl http://localhost:3000/api/vcs/status
```

### 7. View Commit Log
```bash
# Get last 50 commits (default)
curl http://localhost:3000/api/vcs/log

# Get last 10 commits
curl http://localhost:3000/api/vcs/log?limit=10
```

### 8. Get Diff
```bash
# Diff between HEAD and working directory
curl http://localhost:3000/api/vcs/diff

# Diff between two commits
curl "http://localhost:3000/api/vcs/diff?commit1=abc123&commit2=def456"
```

### 9. Get Help
```bash
curl http://localhost:3000/api/vcs/help
```

## Using JavaScript/Node.js

```javascript
const fetch = require('node-fetch'); // or use native fetch in Node 18+

const API_BASE = 'http://localhost:3000/api/vcs';

// Initialize
await fetch(`${API_BASE}/init`, { method: 'POST' });

// Add files
await fetch(`${API_BASE}/add`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pattern: '.*\\.js$' })
});

// Commit
await fetch(`${API_BASE}/commit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Initial commit' })
});

// Status
const status = await fetch(`${API_BASE}/status`).then(r => r.json());
console.log(status);

// Log
const log = await fetch(`${API_BASE}/log?limit=10`).then(r => r.json());
console.log(log);
```

## Using Postman or Similar Tools

1. Set base URL: `http://localhost:3000/api/vcs`
2. For POST requests, set Content-Type header to `application/json`
3. Use the JSON body examples from the curl commands above

