/**
 * Test to verify messages are processed in offset order within partitions
 * Even if messages arrive out of order due to async delivery
 */

const { MessageStreamService, Producer, Consumer } = require('../src');

async function testMessageOrdering() {
  console.log('=== Testing Message Ordering Within Partitions ===\n');

  const service = new MessageStreamService();
  await service.createTopic('order-test-topic', 1);

  const producer = new Producer(service, 'producer-1');
  const consumer = new Consumer(service, 'consumer-1');

  const processingOrder = [];

  consumer.setMessageHandler((message) => {
    processingOrder.push(message.offset);
    console.log(`Processing message offset ${message.offset}: ${message.data}`);
  });

  await consumer.subscribeToTopic('order-test-topic', 0, 0);

  // Publish messages sequentially (they should be stored in order)
  console.log('Publishing 10 messages sequentially...');
  for (let i = 0; i < 10; i++) {
    await producer.send('order-test-topic', 0, `Message ${i}`);
  }

  // Wait for all messages to be processed
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n=== Results ===');
  console.log(`Processing order: ${processingOrder.join(', ')}`);
  console.log(`Expected order: ${Array.from({length: 10}, (_, i) => i).join(', ')}`);

  // Verify messages were processed in order
  const isInOrder = processingOrder.every((offset, index) => offset === index);
  if (isInOrder && processingOrder.length === 10) {
    console.log('✅ PASS: Messages processed in offset order');
  } else {
    console.log('❌ FAIL: Messages not processed in order');
    console.log(`   Expected 10 messages, got ${processingOrder.length}`);
  }
}

async function testOutOfOrderDelivery() {
  console.log('\n\n=== Testing Out-of-Order Message Delivery ===\n');
  console.log('Simulating scenario where messages arrive out of order...\n');

  const service = new MessageStreamService();
  await service.createTopic('out-of-order-topic', 1);

  const producer = new Producer(service, 'producer-1');
  const consumer = new Consumer(service, 'consumer-1');

  const processingOrder = [];
  const arrivalOrder = [];

  consumer.setMessageHandler((message) => {
    processingOrder.push(message.offset);
    console.log(`Processing message offset ${message.offset} (arrived ${arrivalOrder.indexOf(message.offset) + 1}th)`);
  });

  await consumer.subscribeToTopic('out-of-order-topic', 0, 0);

  // Simulate out-of-order delivery by publishing messages and then
  // manually calling onMessage with messages in reverse order
  console.log('Publishing messages 0-9...');
  const messages = [];
  for (let i = 0; i < 10; i++) {
    const offset = await producer.send('out-of-order-topic', 0, `Message ${i}`);
    messages.push({ offset, data: `Message ${i}` });
  }

  // Wait a bit for messages to be queued
  await new Promise(resolve => setTimeout(resolve, 100));

  // Now simulate out-of-order arrival by directly calling onMessage
  // (In real scenario, notifyAsync could deliver messages out of order)
  console.log('\nSimulating out-of-order delivery (9,8,7,...,0)...');
  for (let i = 9; i >= 0; i--) {
    const message = {
      id: `out-of-order-topic:0:${i}`,
      topic: 'out-of-order-topic',
      partition: 0,
      offset: i,
      timestamp: Date.now(),
      data: `Message ${i}`
    };
    arrivalOrder.push(i);
    // Call onMessage directly to simulate out-of-order delivery
    await consumer.onMessage(message);
  }

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n=== Results ===');
  console.log(`Arrival order: ${arrivalOrder.join(', ')}`);
  console.log(`Processing order: ${processingOrder.join(', ')}`);
  console.log(`Expected order: ${Array.from({length: 10}, (_, i) => i).join(', ')}`);

  // Verify messages were processed in offset order despite out-of-order arrival
  const isInOrder = processingOrder.every((offset, index) => offset === index);
  if (isInOrder && processingOrder.length === 10) {
    console.log('✅ PASS: Messages processed in offset order despite out-of-order arrival');
  } else {
    console.log('❌ FAIL: Messages not processed in order');
    console.log(`   Expected 10 messages, got ${processingOrder.length}`);
  }
}

async function testConcurrentPublishing() {
  console.log('\n\n=== Testing Concurrent Publishing ===\n');

  const service = new MessageStreamService();
  await service.createTopic('concurrent-topic', 1);

  const producer = new Producer(service, 'producer-1');
  const consumer = new Consumer(service, 'consumer-1');

  const processingOrder = [];

  consumer.setMessageHandler((message) => {
    processingOrder.push(message.offset);
  });

  await consumer.subscribeToTopic('concurrent-topic', 0, 0);

  // Publish messages concurrently
  console.log('Publishing 20 messages concurrently...');
  const publishPromises = [];
  for (let i = 0; i < 20; i++) {
    publishPromises.push(producer.send('concurrent-topic', 0, `Message ${i}`));
  }
  await Promise.all(publishPromises);

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\n=== Results ===');
  console.log(`Processing order: ${processingOrder.join(', ')}`);
  console.log(`Expected order: ${Array.from({length: 20}, (_, i) => i).join(', ')}`);

  // Verify messages were processed in order
  const isInOrder = processingOrder.every((offset, index) => offset === index);
  if (isInOrder && processingOrder.length === 20) {
    console.log('✅ PASS: Concurrently published messages processed in offset order');
  } else {
    console.log('❌ FAIL: Messages not processed in order');
    console.log(`   Expected 20 messages, got ${processingOrder.length}`);
    if (processingOrder.length > 0) {
      console.log(`   First out-of-order: offset ${processingOrder.find((offset, index) => offset !== index)} at position ${processingOrder.findIndex((offset, index) => offset !== index)}`);
    }
  }
}

// Run tests
(async () => {
  try {
    await testMessageOrdering();
    await testOutOfOrderDelivery();
    await testConcurrentPublishing();
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
})();
