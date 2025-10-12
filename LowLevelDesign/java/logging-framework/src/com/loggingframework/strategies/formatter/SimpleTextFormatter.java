package com.loggingframework.strategies.formatter;

import com.loggingframework.entities.LogMessage;

import java.time.format.DateTimeFormatter;

public class SimpleTextFormatter implements LogFormatter {

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    @Override
    // Tells the compiler you're overriding a superclass or interface method.
    public String format(LogMessage logMessage) {
        return String.format("%s [%s] [%s] %s - %s: %s\n",
                logMessage.getTimestamp().format(DATE_TIME_FORMATTER),
                logMessage.getThreadName(),
                Thread.currentThread().getName(),
                logMessage.getLevel(),
                logMessage.getLoggerName(),
                logMessage.getMessage()
                );
    }
}
