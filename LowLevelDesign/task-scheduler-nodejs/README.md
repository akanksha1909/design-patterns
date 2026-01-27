# Task Scheduler - Node.js Implementation

A task scheduler implementation in Node.js that supports one-time and recurring task execution with observer pattern for task lifecycle events.

## Features

- **Singleton Pattern**: TaskSchedulerService uses singleton pattern for global access
- **Strategy Pattern**: Different scheduling strategies (OneTime, Recurring)
- **Observer Pattern**: Task execution observers for logging and monitoring
- **Priority Queue**: Tasks are executed based on their scheduled time
- **Multi-worker Support**: Configurable number of worker threads for concurrent task execution

## Project Structure

```
src/
├── task/
│   ├── Task.js                    # Base Task interface
│   └── PrintMessageTask.js        # Example task implementation
├── strategy/
│   ├── SchedulingStrategy.js      # Base scheduling strategy interface
│   ├── OneTimeSchedulingStrategy.js    # One-time execution strategy
│   └── RecurringSchedulingStrategy.js  # Recurring execution strategy
├── observer/
│   ├── TaskExecutionObserver.js   # Observer interface
│   └── LoggingObserver.js         # Logging observer implementation
├── ScheduledTask.js               # Wraps Task with scheduling info
├── TaskSchedulerService.js        # Main scheduler service (Singleton)
└── demo.js                        # Example usage

```

## Usage

### Running the Demo

```bash
npm start
# or
node src/demo.js
```

### Example Code

```javascript
import { TaskSchedulerService } from './TaskSchedulerService.js';
import { LoggingObserver } from './observer/LoggingObserver.js';
import { OneTimeSchedulingStrategy } from './strategy/OneTimeSchedulingStrategy.js';
import { RecurringSchedulingStrategy } from './strategy/RecurringSchedulingStrategy.js';
import { PrintMessageTask } from './task/PrintMessageTask.js';

const scheduler = TaskSchedulerService.getInstance();
scheduler.initialize(10); // 10 worker threads

scheduler.addObserver(new LoggingObserver());

// Schedule a one-time task (5 seconds from now)
const oneTimeTask = new PrintMessageTask("One time task");
const oneTimeStrategy = new OneTimeSchedulingStrategy(
    new Date(Date.now() + 5000)
);
scheduler.schedule(oneTimeTask, oneTimeStrategy);

// Schedule a recurring task (every 5 seconds)
const recurringTask = new PrintMessageTask("Recurring task");
const recurringStrategy = new RecurringSchedulingStrategy(5000);
scheduler.schedule(recurringTask, recurringStrategy);

// Shutdown after some time
setTimeout(() => {
    scheduler.shutDown();
}, 15000);
```

## Design Patterns Used

1. **Singleton Pattern**: `TaskSchedulerService` ensures only one instance exists
2. **Strategy Pattern**: Different scheduling strategies can be plugged in
3. **Observer Pattern**: Multiple observers can monitor task execution
4. **Template Method Pattern**: Base classes define structure, subclasses implement details

## Key Differences from Java Version

- Uses Node.js async/await instead of Java threads
- Uses JavaScript Date objects instead of Java LocalDateTime
- Uses native crypto.randomUUID() instead of Java UUID
- Implements priority queue using binary heap instead of PriorityBlockingQueue
- Uses ES6 modules instead of Java packages
