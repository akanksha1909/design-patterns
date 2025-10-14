package com.loggingframework;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.loggingframework.strategies.appender.LogAppender;

public class LogManager {
    private static LogManager instance;
    private final Logger rootLogger;
    private final Map<String, Logger> loggers = new ConcurrentHashMap<>();
    private final AsyncLogProcessor processor;
    private LogManager() {
        this.rootLogger = new Logger("root", null);
        this.loggers.put("root", rootLogger);
        this.processor = new AsyncLogProcessor();
    }

    public static synchronized LogManager getInstance() {
        if(instance == null) {
            instance = new LogManager();
        }
        return instance;
    }

    public Logger getRootLogger() {
        return this.rootLogger;
    }

    public Logger getLogger(String name) {
        return loggers.computeIfAbsent(name, this::createLogger);
    }

    private Logger createLogger(String name) {
        if(name.equals("root")) {
            return rootLogger;
        }
        int lastDot = name.lastIndexOf('.');
        System.out.println("Last Dot " + lastDot);
        String parentName = (lastDot == -1) ? "root" : name.substring(0, lastDot);
        System.out.println("Parent Name " + parentName);
        Logger parent = getLogger(parentName);
        return new Logger(name, parent);
    }

    AsyncLogProcessor getProcessor() {
        return processor;
    }

    public void getLoggers() {
        this.loggers.forEach((key, value) -> {
            if(value.getParent() != null) {
                System.out.println("Logger Name: " + key + " Parent Name: " +  value.getParent().getName());
            }
        });
    }

    public void shutdown() {
        // Stop the processor first to ensure all logs are written
        processor.stop();
         // Then, close all appenders.
        loggers.values().stream()
                .flatMap(logger -> logger.getAppenders().stream())
                .distinct()
                .forEach(LogAppender::close);
        System.out.println("Logging framework shut down gracefully.");
    }
}
