const { MessageStreamService, Producer, Consumer, Topic } = require('../src');

/**
 * Example demonstrating the message streaming service
 */
async function main() {
  console.log('🚀 Starting Message Streaming Service Demo\n');

  // Initialize the service
  const service = new MessageStreamService();

  // Create a topic with 3 partitions
  console.log('📝 Creating topic "orders" with 3 partitions...');
  await service.createTopic('orders', 3);
  console.log('✅ Topic created\n');

  // Get the topic instance (optional - for demonstrating Topic API)
  const ordersTopic = service.topics.get('orders');

  // Create producers
  console.log('👤 Creating producers...');
  const producer1 = new Producer(service, 'producer-1');
  const producer2 = new Producer(service, 'producer-2');
  console.log('✅ Producers created\n');

  // Create consumers
  console.log('👥 Creating consumers...');
  const consumer1 = new Consumer(service, 'consumer-1', 'group-1');
  const consumer2 = new Consumer(service, 'consumer-2', 'group-1');
  const consumer3 = new Consumer(service, 'consumer-3', 'group-2');
  console.log('✅ Consumers created\n');

  // Set up consumer message handlers using callback
  // These callbacks will be invoked automatically when messages are published
  // Message flow: Producer → Service → Topic → Consumer.onMessage() → Callback
  consumer1.setMessageHandler((msg) => {
    console.log(`📨 Consumer-1 received: Order ${msg.data.orderId} (Partition ${msg.partition}, Offset ${msg.offset})`);
  });

  consumer2.setMessageHandler((msg) => {
    console.log(`📨 Consumer-2 received: Order ${msg.data.orderId} (Partition ${msg.partition}, Offset ${msg.offset})`);
  });

  consumer3.setMessageHandler((msg) => {
    console.log(`📨 Consumer-3 received: Order ${msg.data.orderId} (Partition ${msg.partition}, Offset ${msg.offset})`);
  });

  // Subscribe consumers to partitions
  console.log('🔔 Subscribing consumers...');
  
  // How messages flow from Producer to Consumer (automatic push-based delivery):
  // 1. Producer publishes: producer.send() → service.publish() → topic.publish() → message stored
  // 2. Topic notifies: Gets all consumers subscribed to partition → calls consumer.onMessage()
  // 3. Consumer processes: onMessage() validates subscription → updates offset → calls message handler
  // 4. Message handler: The callback registered with consumer.setMessageHandler() is invoked
  // 
  // This is push-based: Consumers don't "fetch" messages, they receive them automatically via callbacks
  
  await consumer1.subscribeToTopic('orders', 0); // Consumer-1 subscribes to partition 0
  await consumer2.subscribeToTopic('orders', 1); // Consumer-2 subscribes to partition 1
  await consumer3.subscribeToTopic('orders', 2); // Consumer-3 subscribes to partition 2
  
  console.log('✅ Consumers subscribed\n');

  // Publish messages from multiple producers concurrently
  console.log('📤 Publishing messages concurrently...\n');
  
  const publishPromises = [];
  
  // Producer 1 publishes to partition 0
  for (let i = 1; i <= 5; i++) {
    publishPromises.push(
      producer1.send('orders', 0, { orderId: `P1-ORDER-${i}`, amount: 100 * i })
        .then(result => {
          console.log(`✅ Producer-1 published to partition ${result.partition}, offset ${result.offset}`);
        })
    );
  }

  // Producer 2 publishes to partition 1
  for (let i = 1; i <= 5; i++) {
    publishPromises.push(
      producer2.send('orders', 1, { orderId: `P2-ORDER-${i}`, amount: 200 * i })
        .then(result => {
          console.log(`✅ Producer-2 published to partition ${result.partition}, offset ${result.offset}`);
        })
    );
  }

  // Producer 1 also publishes to partition 2
  for (let i = 1; i <= 5; i++) {
    publishPromises.push(
      producer1.send('orders', 2, { orderId: `P1-ORDER-P2-${i}`, amount: 150 * i })
        .then(result => {
          console.log(`✅ Producer-1 published to partition ${result.partition}, offset ${result.offset}`);
        })
    );
  }

  // Wait for all publishes to complete
  await Promise.all(publishPromises);
  console.log('\n✅ All messages published\n');

  // Wait a bit for messages to be delivered
  await new Promise(resolve => setTimeout(resolve, 100));

  // Demonstrate batch publishing
  // console.log('📦 Publishing batch messages...');
  // const batchMessages = [
  //   { orderId: 'BATCH-1', amount: 500 },
  //   { orderId: 'BATCH-2', amount: 600 },
  //   { orderId: 'BATCH-3', amount: 700 }
  // ];
  
  // await producer1.sendBatch('orders', batchMessages);
  // console.log('✅ Batch messages published\n');

  // // Wait for batch messages to be delivered
  // await new Promise(resolve => setTimeout(resolve, 100));

  // // Get topic information
  // console.log('📊 Topic Information:');
  // const topicInfo = await service.getTopicInfo('orders');
  // console.log(JSON.stringify(topicInfo, null, 2));
  // console.log();

  // // Get consumer statistics
  console.log('📈 Consumer Statistics:');
  console.log('Consumer-1:', JSON.stringify(consumer1.getStats(), null, 2));
  console.log('Consumer-2:', JSON.stringify(consumer2.getStats(), null, 2));
  console.log('Consumer-3:', JSON.stringify(consumer3.getStats(), null, 2));
  console.log();

  // // Demonstrate seeking to a specific offset
  // console.log('🔍 Demonstrating seek functionality...');
  // await consumer1.seek('orders', 0, 2); // Seek to offset 2 in partition 0
  // console.log('✅ Consumer-1 seeked to offset 2\n');

  // // Demonstrate reading messages manually
  // console.log('📖 Reading messages manually from partition 0, offset 0:');
  // const messages = await service.getMessages('orders', 0, 0, 3);
  // messages.forEach(msg => {
  //   console.log(`  - Offset ${msg.offset}: ${JSON.stringify(msg.data)}`);
  // });
  // console.log();

  // // Clean up
  // console.log('🧹 Cleaning up...');
  // await consumer1.unsubscribeAll();
  // await consumer2.unsubscribeAll();
  // await consumer3.unsubscribeAll();
  // console.log('✅ Cleanup complete\n');

  console.log('✨ Demo completed successfully!');
}

// Run the example
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
