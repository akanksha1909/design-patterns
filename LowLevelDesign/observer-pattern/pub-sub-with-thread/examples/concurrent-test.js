const { MessageStreamService, Producer, Consumer } = require('../src');

/**
 * Test demonstrating thread safety with concurrent operations
 */
async function concurrentTest() {
  console.log('🧪 Testing Thread Safety with Concurrent Operations\n');

  const service = new MessageStreamService();
  
  // Create topic
  await service.createTopic('test-topic', 2);
  console.log('✅ Topic created\n');

  // Create multiple producers and consumers
  const producers = [
    new Producer(service, 'producer-1'),
    new Producer(service, 'producer-2'),
    new Producer(service, 'producer-3')
  ];

  const consumers = [
    new Consumer(service, 'consumer-1', 'group-1'),
    new Consumer(service, 'consumer-2', 'group-1')
  ];

  // Track received messages to verify ordering
  const receivedMessages = {
    0: [],
    1: []
  };

  consumers[0].setMessageHandler((msg) => {
    receivedMessages[0].push(msg.offset);
    console.log(`Consumer-1: Partition ${msg.partition}, Offset ${msg.offset}`);
  });

  consumers[1].setMessageHandler((msg) => {
    receivedMessages[1].push(msg.offset);
    console.log(`Consumer-2: Partition ${msg.partition}, Offset ${msg.offset}`);
  });

  // Subscribe consumers
  await consumers[0].subscribeToTopic('test-topic', 0);
  await consumers[1].subscribeToTopic('test-topic', 1);
  console.log('✅ Consumers subscribed\n');

  // Concurrent publishing from multiple producers
  console.log('📤 Publishing 20 messages concurrently from 3 producers...\n');
  
  const publishPromises = [];
  
  for (let i = 0; i < 20; i++) {
    const producer = producers[i % 3];
    const partition = i % 2;
    
    publishPromises.push(
      producer.send('test-topic', partition, { 
        id: i, 
        producer: producer.id,
        partition 
      })
    );
  }

  await Promise.all(publishPromises);
  console.log('\n✅ All messages published\n');

  // Wait for delivery
  await new Promise(resolve => setTimeout(resolve, 200));

  // Verify ordering within partitions
  console.log('📊 Verifying message ordering...\n');
  
  const partition0Offsets = receivedMessages[0];
  const partition1Offsets = receivedMessages[1];

  console.log(`Partition 0 offsets: [${partition0Offsets.join(', ')}]`);
  console.log(`Partition 1 offsets: [${partition1Offsets.join(', ')}]\n`);

  // Check if offsets are in order
  const isPartition0Ordered = partition0Offsets.every((offset, idx) => 
    idx === 0 || offset > partition0Offsets[idx - 1]
  );
  
  const isPartition1Ordered = partition1Offsets.every((offset, idx) => 
    idx === 0 || offset > partition1Offsets[idx - 1]
  );

  if (isPartition0Ordered && isPartition1Ordered) {
    console.log('✅ Message ordering verified: All messages are in order within partitions\n');
  } else {
    console.log('❌ Message ordering violation detected!\n');
  }

  // Test concurrent reads
  console.log('📖 Testing concurrent reads...\n');
  const readPromises = [
    service.getMessages('test-topic', 0, 0, 5),
    service.getMessages('test-topic', 0, 5, 5),
    service.getMessages('test-topic', 1, 0, 5),
    service.getMessages('test-topic', 1, 5, 5)
  ];

  const readResults = await Promise.all(readPromises);
  console.log(`✅ Concurrent reads completed: ${readResults.length} operations\n`);

  // Verify no data corruption
  const allMessages = readResults.flat();
  const uniqueIds = new Set(allMessages.map(m => m.id));
  
  if (uniqueIds.size === allMessages.length) {
    console.log('✅ No data corruption detected\n');
  } else {
    console.log('❌ Data corruption detected!\n');
  }

  console.log('✨ Concurrent test completed successfully!');
}

concurrentTest().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
