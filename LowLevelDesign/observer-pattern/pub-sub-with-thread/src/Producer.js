const Observable = require('./utils/Observable');

/**
 * Producer - Publishes messages to topics and partitions
 * Uses Observer Pattern for event notifications
 */
class Producer extends Observable {
  /**
   * @param {MessageStreamService} service - The message streaming service instance
   * @param {string} producerId - Unique identifier for this producer
   */
  constructor(service, producerId) {
    super();
    this.service = service;
    this.id = producerId || `producer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Publishes a message to a topic and partition
   * @param {string} topicName - Name of the topic
   * @param {number} partitionId - Partition ID (optional, defaults to 0)
   * @param {any} message - Message data to publish
   * @returns {Promise<Object>} - Published message with metadata
   */
  async send(topicName, partitionId = 0, message) {
    try {
      const offset = await this.service.publish(topicName, partitionId, message);
      
      const result = {
        topic: topicName,
        partition: partitionId,
        offset,
        message
      };

      this.notify('message:sent', result);
      return result;
    } catch (error) {
      this.notify('error', error);
      throw error;
    }
  }
}

module.exports = Producer;
