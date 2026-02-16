/**
 * Test to verify atomic coordination between offset commit and message processing
 * Demonstrates that offset is only committed AFTER successful message processing
 */

const { MessageStreamService, Producer, Consumer } = require('../src');

async function testAtomicOffsetCommit() {
  console.log('=== Testing Atomic Offset Commit ===\n');

  const service = new MessageStreamService();
  await service.createTopic('test-topic', 1);

  const producer = new Producer(service, 'producer-1');
  const consumer = new Consumer(service, 'consumer-1');

  let processedMessages = [];
  let failedMessages = [];

  // Set up message handler that fails on specific messages
  consumer.setMessageHandler((message) => {
    console.log(`Processing message offset ${message.offset}: ${message.data}`);
    
    // Simulate failure for message with offset 2
    if (message.offset === 2) {
      throw new Error(`Intentional failure for message offset ${message.offset}`);
    }
    
    processedMessages.push(message.offset);
  });

  // Subscribe to topic
  await consumer.subscribeToTopic('test-topic', 0, 0);

  // Publish 5 messages
  console.log('Publishing 5 messages...');
  for (let i = 0; i < 5; i++) {
    await producer.send('test-topic', 0, `Message ${i}`);
  }

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check results
  console.log('\n=== Results ===');
  console.log(`Processed messages (offsets): ${processedMessages.join(', ')}`);
  console.log(`Current consumer offset: ${consumer.getOffset('test-topic', 0)}`);
  console.log(`Total messages in topic: ${await service.getOffset('test-topic', 0)}`);

  // Verify atomic coordination
  console.log('\n=== Verification ===');
  
  // Offset should be 3 (0, 1 processed, 2 failed, so offset stays at 2, then 3 is processed)
  // Actually, let's think: if offset 2 fails, offset should remain at 2
  // But offset 3, 4 might have been processed already due to async nature
  
  // Better approach: check that offset 2 was not committed
  const currentOffset = consumer.getOffset('test-topic', 0);
  const expectedOffset = processedMessages.length + 1; // +1 because we start from 0
  
  if (currentOffset === processedMessages.length) {
    console.log('✅ PASS: Offset matches processed messages count');
    console.log(`   Offset committed: ${currentOffset}, Messages processed: ${processedMessages.length}`);
  } else {
    console.log('❌ FAIL: Offset does not match processed messages');
    console.log(`   Offset committed: ${currentOffset}, Messages processed: ${processedMessages.length}`);
  }

  // Verify that failed message (offset 2) can be re-delivered
  console.log('\n=== Testing Re-delivery ===');
  console.log(`Seeking back to offset 2...`);
  await consumer.seek('test-topic', 0, 2);
  
  // Update handler to succeed this time
  let retryCount = 0;
  consumer.setMessageHandler((message) => {
    retryCount++;
    console.log(`Retry processing message offset ${message.offset}: ${message.data}`);
    processedMessages.push(message.offset);
  });

  // Wait for re-delivery
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`After retry, offset: ${consumer.getOffset('test-topic', 0)}`);
  console.log(`Messages processed after retry: ${processedMessages.join(', ')}`);
  
  if (retryCount > 0) {
    console.log('✅ PASS: Failed message was re-delivered');
  } else {
    console.log('❌ FAIL: Failed message was not re-delivered');
  }
}

async function testConcurrentMessageProcessing() {
  console.log('\n\n=== Testing Concurrent Message Processing ===\n');

  const service = new MessageStreamService();
  await service.createTopic('concurrent-topic', 1);

  const producer = new Producer(service, 'producer-1');
  const consumer = new Consumer(service, 'consumer-1');

  let processingOrder = [];
  let processingInProgress = false;

  consumer.setMessageHandler(async (message) => {
    // Simulate async processing
    if (processingInProgress) {
      console.log(`⚠️  WARNING: Concurrent processing detected for offset ${message.offset}`);
    }
    processingInProgress = true;
    
    await new Promise(resolve => setTimeout(resolve, 10));
    processingOrder.push(message.offset);
    
    processingInProgress = false;
  });

  await consumer.subscribeToTopic('concurrent-topic', 0, 0);

  // Publish multiple messages concurrently
  console.log('Publishing 10 messages concurrently...');
  const publishPromises = [];
  for (let i = 0; i < 10; i++) {
    publishPromises.push(producer.send('concurrent-topic', 0, `Message ${i}`));
  }
  await Promise.all(publishPromises);

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n=== Results ===');
  console.log(`Processing order: ${processingOrder.join(', ')}`);
  console.log(`Current offset: ${consumer.getOffset('concurrent-topic', 0)}`);
  
  // Verify sequential processing (should be in order due to locking)
  const isSequential = processingOrder.every((offset, index) => offset === index);
  if (isSequential) {
    console.log('✅ PASS: Messages processed sequentially (no race conditions)');
  } else {
    console.log('❌ FAIL: Messages not processed sequentially');
  }
}

// Run tests
(async () => {
  try {
    await testAtomicOffsetCommit();
    await testConcurrentMessageProcessing();
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
})();
