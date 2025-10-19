package com.taskscheduler;

// Comparable Interface is built in Java interface that allows object to
// be compared with each other to determine their ordering
// It defines one method int compareTo(T other) which tells java how to compare two objects of type T

import com.taskscheduler.strategy.SchedulingStrategy;
import com.taskscheduler.task.Task;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public class ScheduledTask implements Comparable<ScheduledTask> {

    private LocalDateTime nextExecutionTime;
    private LocalDateTime lastExecutionTime;
    private final String id;
    private final Task task;
    private final SchedulingStrategy strategy;

    public ScheduledTask(Task task, SchedulingStrategy strategy) {
        this.id = UUID.randomUUID().toString();
        this.task = task;
        this.strategy = strategy;
        updateNextExecutionTime();
    }

    public void updateNextExecutionTime() {
        Optional<LocalDateTime> nextTime = strategy.getNextExecutionTime(this.lastExecutionTime);
        this.nextExecutionTime = nextTime.orElse(null);
    }

    public void updateLastExecutionTime() {
        this.lastExecutionTime = nextExecutionTime;
    }

    // It returns Negative -> this object < other
    // It returns Positive -> this object > other
    // Zero -> this.object == other
    @Override
    public int compareTo(ScheduledTask other) {
        return this.nextExecutionTime.compareTo(other.nextExecutionTime);
    }

    public LocalDateTime getNextExecutionTime() {
        return nextExecutionTime;
    }

    public Task getTask() {
        return task;
    }

    public String getId() {
        return this.id;
    }

    public boolean hasMoreExecutions() {
        return nextExecutionTime != null;
    }
}
