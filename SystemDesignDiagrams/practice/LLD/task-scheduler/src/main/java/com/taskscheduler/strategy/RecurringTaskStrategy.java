package com.taskscheduler.strategy;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

public class RecurringTaskStrategy implements SchedulingStrategy {
    private final Duration interval;
    public RecurringTaskStrategy(Duration interval) {
        this.interval = interval;
    }

    public Optional<LocalDateTime> execute(LocalDateTime lastExecutionTime) {
        LocalDateTime baseTime = (lastExecutionTime == null) ? LocalDateTime.now(): lastExecutionTime;
        return Optional.of(baseTime.plus(interval));
    }
}
