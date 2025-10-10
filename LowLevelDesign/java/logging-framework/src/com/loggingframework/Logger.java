package com.loggingframework;

import com.loggingframework.enums.LogLevel;
import com.loggingframework.strategies.appender.LogAppender;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class Logger {
    private final String name;
    private final Logger parent;
    private LogLevel level;
    private final List<LogAppender> appenders;

    Logger(String name, Logger parent) {
        this.name = name;
        this.parent = parent;
        this.appenders = new CopyOnWriteArrayList<>();
    }

    public void setLevel(LogLevel minLevel) {
        this.level = minLevel;
    }
}
