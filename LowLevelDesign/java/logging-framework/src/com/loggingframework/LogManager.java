package com.loggingframework;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class LogManager {
    private static LogManager instance;
    private final Logger rootLogger;
    private final Map<String, Logger> loggers = new ConcurrentHashMap<>();
    private LogManager() {
        this.rootLogger = new Logger("root", null);
        this.loggers.put("root", rootLogger);
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
}
