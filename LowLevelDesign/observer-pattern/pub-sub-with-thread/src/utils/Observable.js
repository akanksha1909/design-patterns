/**
 * Observable - Implements the Observer Pattern
 * Subject maintains a list of observers and notifies them of state changes
 */
class Observable {
  constructor() {
    // Map<eventType, Set<Observer>>
    this.observers = new Map();
  }

  /**
   * Subscribes an observer to a specific event type
   * @param {string} eventType - Type of event to observe
   * @param {Function} observer - Observer callback function
   * @returns {Function} - Unsubscribe function
   */
  subscribe(eventType, observer) {
    if (typeof observer !== 'function') {
      throw new Error('Observer must be a function');
    }

    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Set());
    }

    this.observers.get(eventType).add(observer);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventType, observer);
    };
  }

  /**
   * Unsubscribes an observer from a specific event type
   * @param {string} eventType - Type of event
   * @param {Function} observer - Observer callback function
   */
  unsubscribe(eventType, observer) {
    if (!this.observers.has(eventType)) {
      return;
    }

    this.observers.get(eventType).delete(observer);

    // Clean up empty event types
    if (this.observers.get(eventType).size === 0) {
      this.observers.delete(eventType);
    }
  }

  /**
   * Notifies all observers of a specific event type
   * @param {string} eventType - Type of event
   * @param {any} data - Data to pass to observers
   */
  notify(eventType, data) {
    if (!this.observers.has(eventType)) {
      return;
    }

    const observers = this.observers.get(eventType);
    
    // Create a copy of the set to avoid issues if observers modify during iteration
    const observersCopy = Array.from(observers);
    
    observersCopy.forEach(observer => {
      try {
        observer(data);
      } catch (error) {
        // Emit error event if available, otherwise log
        if (this.observers.has('error')) {
          this.notify('error', error);
        } else {
          console.error('Error in observer:', error);
        }
      }
    });
  }

  /**
   * Notifies all observers asynchronously (non-blocking)
   * Handles both sync and async observers properly
   * @param {string} eventType - Type of event
   * @param {any} data - Data to pass to observers
   */
  notifyAsync(eventType, data) {
    if (!this.observers.has(eventType)) {
      return;
    }

    const observers = this.observers.get(eventType);
    const observersCopy = Array.from(observers);
    
    // Use process.nextTick for async notification
    process.nextTick(() => {
      observersCopy.forEach(observer => {
        try {
          const result = observer(data);
          // Handle async observers (promises)
          if (result instanceof Promise) {
            result.catch(error => {
              if (this.observers.has('error')) {
                this.notify('error', error);
              } else {
                console.error('Error in async observer:', error);
              }
            });
          }
        } catch (error) {
          // Handle sync observer errors
          if (this.observers.has('error')) {
            this.notify('error', error);
          } else {
            console.error('Error in observer:', error);
          }
        }
      });
    });
  }

  /**
   * Gets the number of observers for a specific event type
   * @param {string} eventType - Type of event
   * @returns {number} - Number of observers
   */
  getObserverCount(eventType) {
    if (!this.observers.has(eventType)) {
      return 0;
    }
    return this.observers.get(eventType).size;
  }

  /**
   * Gets all event types that have observers
   * @returns {Array<string>} - Array of event types
   */
  getEventTypes() {
    return Array.from(this.observers.keys());
  }

  /**
   * Removes all observers for a specific event type
   * @param {string} eventType - Type of event (optional, removes all if not provided)
   */
  removeAllObservers(eventType = null) {
    if (eventType) {
      this.observers.delete(eventType);
    } else {
      this.observers.clear();
    }
  }
}

module.exports = Observable;
