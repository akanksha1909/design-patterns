const { MessageStreamService, Producer, Consumer, Observable } = require('../src');

/**
 * Example demonstrating the Observer Pattern implementation
 */
async function observerPatternDemo() {
  console.log('👁️  Observer Pattern Demonstration\n');

  // Initialize the service
  const service = new MessageStreamService();
  const producer = new Producer(service, 'producer-1');
  const consumer = new Consumer(service, 'consumer-1', 'group-1');

  // Create topic
  await service.createTopic('demo-topic', 1);
  console.log('✅ Topic created\n');

  // Set up message handler (simplified - single callback instead of multiple observers)
  console.log('📡 Setting up message handler...\n');

  // Simplified: Single message handler callback
  // Note: For multiple handlers, you can combine them in a single callback
  consumer.setMessageHandler((msg) => {
    console.log(`  Received message ${msg.data.id}`);
    // You can add multiple processing steps here if needed
  });

  console.log('✅ Message handler set\n');

  // Subscribe consumer to topic
  await consumer.subscribeToTopic('demo-topic', 0);
  console.log('✅ Consumer subscribed to topic\n');

  // Publish messages - all observers will be notified
  console.log('📤 Publishing messages...\n');
  
  await producer.send('demo-topic', 0, { id: 1, data: 'Message 1' });
  await producer.send('demo-topic', 0, { id: 2, data: 'Message 2' });

  // Wait for delivery
  await new Promise(resolve => setTimeout(resolve, 100));

  // Change message handler (simplified - just set a new handler)
  console.log('\n🔌 Changing message handler...\n');
  
  consumer.setMessageHandler((msg) => {
    console.log(`  Updated handler: Received message ${msg.data.id}`);
  });

  console.log('✅ Message handler updated\n');

  // Publish another message - only 2 observers will be notified
  await producer.send('demo-topic', 0, { id: 3, data: 'Message 3' });

  await new Promise(resolve => setTimeout(resolve, 100));

  // Demonstrate service-level observers
  console.log('\n📡 Demonstrating service-level observers...\n');

  const serviceObserver = (data) => {
    console.log(`  Service Observer: Topic '${data.topicName}' was created with ${data.numPartitions} partitions`);
  };

  // Subscribe to service events using Observable's subscribe method
  const unsubscribeService = service.subscribe('topic:created', serviceObserver);

  await service.createTopic('another-topic', 2);
  await new Promise(resolve => setTimeout(resolve, 50));

  // Demonstrate producer observers
  console.log('\n📡 Demonstrating producer observers...\n');

  const producerObserver = (result) => {
    console.log(`  Producer Observer: Message sent to partition ${result.partition}, offset ${result.offset}`);
  };

  producer.subscribe('message:sent', producerObserver);

  await producer.send('demo-topic', 0, { id: 4, data: 'Message 4' });
  await new Promise(resolve => setTimeout(resolve, 50));

  // Show event types (Consumer no longer extends Observable)
  console.log('\n📋 Event types with observers:');
  console.log(`   Producer: [${producer.getEventTypes().join(', ')}]`);
  console.log(`   Service: [${service.getEventTypes().join(', ')}]`);
  console.log(`   Consumer: Uses simple callback (setMessageHandler)`);

  console.log('\n✨ Observer Pattern demonstration completed!');
  console.log('\nKey Points:');
  console.log('  ✅ Topic uses Observer Pattern to notify consumers');
  console.log('  ✅ Consumer uses simple callback (setMessageHandler)');
  console.log('  ✅ Cleaner, simpler design');
  console.log('  ✅ Thread-safe message delivery');
  console.log('  ✅ Error handling in message handlers');
}

observerPatternDemo().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
