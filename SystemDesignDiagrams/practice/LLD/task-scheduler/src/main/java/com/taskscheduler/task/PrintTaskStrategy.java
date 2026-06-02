package com.taskscheduler.task;

import java.time.LocalDateTime;

public class PrintTaskStrategy implements Task {
    private final String message;
    public PrintTaskStrategy(String message) {
        this.message = message;
    }

    public void execute() {
        System.out.printf("[%s] Executing PrintMessageTask %s%n", LocalDateTime.now(), message);
    }
}
