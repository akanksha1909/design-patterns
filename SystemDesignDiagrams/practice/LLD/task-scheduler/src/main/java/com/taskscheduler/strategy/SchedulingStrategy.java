package com.taskscheduler.strategy;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SchedulingStrategy {
    public Optional<LocalDateTime> execute(LocalDateTime lastExecutionTime);
}
