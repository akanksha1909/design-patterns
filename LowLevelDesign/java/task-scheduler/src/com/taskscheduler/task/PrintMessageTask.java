package com.taskscheduler.task;

import java.time.LocalDateTime;

public class PrintMessageTask implements Task {
    private final String message;

    public PrintMessageTask(String message) {
        this.message = message;
    }

    @Override
    public void execute() {
        System.out.printf("[%s] Executing PrintMessageTask: %s%n", LocalDateTime.now(), message);
    }
}
