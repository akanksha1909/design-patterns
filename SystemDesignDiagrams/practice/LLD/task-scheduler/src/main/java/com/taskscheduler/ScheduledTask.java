package com.taskscheduler;

import com.taskscheduler.strategy.SchedulingStrategy;
import com.taskscheduler.task.Task;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

// implements Comparable
public class ScheduledTask implements Comparable<ScheduledTask> {
    private String id;
    private LocalDateTime nextExecutionTime;
    private LocalDateTime lastExecutionTime;
    private Task task;
    private SchedulingStrategy schedulingStrategy;

    public ScheduledTask(Task task, SchedulingStrategy strategy) {
        this.id = UUID.randomUUID().toString();
        this.task = task;
        this.schedulingStrategy = strategy;
        updateNextExecutionTime();
    }

    public String getId() {
        return this.id;
    }

    // This also
    public void updateNextExecutionTime() {
        Optional<LocalDateTime> nextTime = this.schedulingStrategy.execute(this.lastExecutionTime);
        this.nextExecutionTime = nextTime.orElse(null);
    }

    public LocalDateTime getNextExecutionTime() {
        return this.nextExecutionTime;
    }

    public Task getTask() {
        return this.task;
    }

    public void updateLastExecutionTime() {
        this.lastExecutionTime = nextExecutionTime;
    }

    // Signature of this method
    @Override
    public int compareTo(ScheduledTask o) {
        return this.nextExecutionTime.compareTo(o.nextExecutionTime);
    }

    public boolean hasMoreExecutions() {
        return this.nextExecutionTime != null;
    }
}
