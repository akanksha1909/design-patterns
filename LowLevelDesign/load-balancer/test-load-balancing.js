#!/usr/bin/env node

/**
 * Test script to verify load balancing is working
 */

import axios from 'axios';

const LB_URL = process.env.LB_URL || 'http://localhost:3000';
const NUM_REQUESTS = 10;

async function testLoadBalancing() {
  console.log(`🔄 Testing Load Balancing with ${NUM_REQUESTS} requests\n`);
  console.log('='.repeat(50));

  const serverCounts = {};
  const requests = [];

  // Make multiple requests
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    try {
      const response = await axios.get(`${LB_URL}/api/users`);
      const serverId = response.data._metadata?.serverId || 'unknown';
      
      serverCounts[serverId] = (serverCounts[serverId] || 0) + 1;
      requests.push({ request: i, server: serverId });
      
      console.log(`Request ${i.toString().padStart(2)} → ${serverId}`);
    } catch (error) {
      console.error(`Request ${i} failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log('='.repeat(50));
  
  Object.entries(serverCounts).forEach(([server, count]) => {
    const percentage = ((count / NUM_REQUESTS) * 100).toFixed(1);
    console.log(`   ${server}: ${count} requests (${percentage}%)`);
  });

  // Check if load balancing is working
  const servers = Object.keys(serverCounts);
  if (servers.length > 1) {
    console.log('\n✅ Load balancing is working! Requests distributed across multiple servers.');
  } else if (servers.length === 1) {
    console.log('\n⚠️  All requests went to the same server:', servers[0]);
    console.log('   This could mean:');
    console.log('   1. Only one server is registered');
    console.log('   2. Other servers are unhealthy');
    console.log('   3. Algorithm issue');
    console.log('\n   Check: curl http://localhost:3000/api/config/servers | jq');
  }

  // Show request pattern
  console.log('\n📈 Request Pattern:');
  requests.forEach(req => {
    const marker = req.server === 'server1' ? '🟢' : '🔵';
    process.stdout.write(`${marker} `);
  });
  console.log('\n   🟢 = server1  🔵 = server2\n');
}

testLoadBalancing().catch(error => {
  console.error('❌ Error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('\n⚠️  Cannot connect to load balancer. Make sure it\'s running: npm start');
  }
});


