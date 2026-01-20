#!/bin/bash

# Example usage script for Load Balancer
# Make sure the load balancer and mock servers are running first

echo "🚀 Load Balancer Example Usage"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

LB_URL="http://localhost:3000"

echo -e "${BLUE}1. Adding backend servers...${NC}"
curl -X POST $LB_URL/api/config/servers \
  -H "Content-Type: application/json" \
  -d '{"id": "server1", "url": "http://localhost:3001", "weight": 1}' | jq

echo ""
curl -X POST $LB_URL/api/config/servers \
  -H "Content-Type: application/json" \
  -d '{"id": "server2", "url": "http://localhost:3002", "weight": 2}' | jq

echo ""
curl -X POST $LB_URL/api/config/servers \
  -H "Content-Type: application/json" \
  -d '{"id": "server3", "url": "http://localhost:3003", "weight": 1}' | jq

echo ""
echo -e "${BLUE}2. Getting all servers...${NC}"
curl -s $LB_URL/api/config/servers | jq

echo ""
echo -e "${BLUE}3. Getting load balancer stats...${NC}"
curl -s $LB_URL/api/config/stats | jq

echo ""
echo -e "${BLUE}4. Testing load balancing (Round Robin)...${NC}"
for i in {1..6}; do
  echo -e "${GREEN}Request $i:${NC}"
  curl -s $LB_URL/api/users | jq -r '.data[0].server, ._metadata.serverId'
  echo ""
done

echo ""
echo -e "${BLUE}5. Changing to Least Connections algorithm...${NC}"
curl -X PUT $LB_URL/api/config/algorithm \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "least-connections"}' | jq

echo ""
echo -e "${BLUE}6. Testing with Least Connections...${NC}"
for i in {1..3}; do
  echo -e "${GREEN}Request $i:${NC}"
  curl -s $LB_URL/api/users | jq -r '.data[0].server, ._metadata.serverId'
  echo ""
done

echo ""
echo -e "${BLUE}7. Checking health status...${NC}"
curl -s $LB_URL/api/health/servers | jq

echo ""
echo -e "${BLUE}8. Getting final stats...${NC}"
curl -s $LB_URL/api/config/stats | jq

echo ""
echo -e "${GREEN}✅ Example completed!${NC}"

