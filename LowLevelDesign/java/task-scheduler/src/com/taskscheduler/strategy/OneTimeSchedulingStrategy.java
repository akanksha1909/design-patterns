package com.taskscheduler.strategy;

import java.time.LocalDateTime;
import java.util.Optional;

public class OneTimeSchedulingStrategy implements SchedulingStrategy {
    private final LocalDateTime executionTime;

    public OneTimeSchedulingStrategy(LocalDateTime executionTime) {
        this.executionTime = executionTime;
    }

    @Override
    public Optional<LocalDateTime> getNextExecutionTime(LocalDateTime lastExecutionTime){
        // If lastExecutionTime is null, it's the first run. Otherwise it is done.
        // Optional.empty() returns an empty Optional instance,
        // meaning → it contains no value inside.
        // Optional.empty().isPresent() -> False
        return (lastExecutionTime == null) ? Optional.of(executionTime): Optional.empty();
    }
}
