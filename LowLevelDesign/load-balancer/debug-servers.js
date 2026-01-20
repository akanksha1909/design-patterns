#!/usr/bin/env node

/**
 * Diagnostic script to check load balancer server status
 */

import axios from 'axios';

const LB_URL = process.env.LB_URL || 'http://localhost:3000';

async function checkServers() {
  console.log('🔍 Checking Load Balancer Server Status\n');
  console.log('='.repeat(50));

  try {
    // Check registered servers
    console.log('\n1️⃣ Registered Servers:');
    const serversResponse = await axios.get(`${LB_URL}/api/config/servers`);
    const serversData = serversResponse.data;
    
    if (serversData.success && serversData.data) {
      console.log(`   Total servers: ${serversData.data.length}`);
      serversData.data.forEach(server => {
        console.log(`   - ${server.id}: ${server.url} (weight: ${server.weight}, healthy: ${server.isHealthy})`);
      });
    } else {
      console.log('   ❌ No servers registered or error:', serversData);
    }

    // Check health status
    console.log('\n2️⃣ Health Status:');
    const healthResponse = await axios.get(`${LB_URL}/api/health/servers`);
    const healthData = healthResponse.data;
    
    if (healthData.success && healthData.data) {
      healthData.data.forEach(server => {
        const status = server.isHealthy ? '✅' : '❌';
        console.log(`   ${status} ${server.id}: ${server.url}`);
        console.log(`      Healthy: ${server.isHealthy}`);
        console.log(`      Last check: ${server.lastHealthCheck || 'Never'}`);
        console.log(`      Response time: ${server.responseTime || 'N/A'}ms`);
      });
    }

    // Check request distribution
    console.log('\n3️⃣ Request Distribution:');
    const requestsResponse = await axios.get(`${LB_URL}/api/config/requests`);
    const requestsData = requestsResponse.data;
    
    if (requestsData.success && requestsData.data) {
      console.log(`   Total requests: ${requestsData.data.totalRequests}`);
      console.log(`   Algorithm: ${requestsData.data.algorithm}`);
      if (requestsData.data.servers) {
        requestsData.data.servers.forEach(server => {
          console.log(`   - ${server.id}: ${server.totalRequests} requests (${server.percentage})`);
        });
      }
    }

    // Check current algorithm
    console.log('\n4️⃣ Current Algorithm:');
    const algoResponse = await axios.get(`${LB_URL}/api/config/algorithm`);
    const algoData = algoResponse.data;
    if (algoData.success) {
      console.log(`   ${algoData.data.algorithm}`);
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    const servers = serversData.data || [];
    if (servers.length < 2) {
      console.log('   ⚠️  Only one server registered. Add server2:');
      console.log(`   curl -X POST ${LB_URL}/api/config/servers \\`);
      console.log(`     -H "Content-Type: application/json" \\`);
      console.log(`     -d '{"id": "server2", "url": "http://localhost:3002"}'`);
    } else {
      const unhealthyServers = servers.filter(s => !s.isHealthy);
      if (unhealthyServers.length > 0) {
        console.log('   ⚠️  Some servers are unhealthy:');
        unhealthyServers.forEach(s => {
          console.log(`      - ${s.id} (${s.url})`);
        });
        console.log(`   Try: curl -X POST ${LB_URL}/api/health/check`);
      } else {
        console.log('   ✅ All servers are healthy!');
        console.log('   Make multiple requests to see load balancing:');
        console.log(`   for i in {1..10}; do curl -s ${LB_URL}/api/users | jq -r '._metadata.serverId'; done`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log(`\n⚠️  Cannot connect to load balancer at ${LB_URL}`);
      console.log('   Make sure the load balancer is running: npm start');
    } else {
      console.log('\nMake sure the load balancer is running on', LB_URL);
    }
  }
}

checkServers();

