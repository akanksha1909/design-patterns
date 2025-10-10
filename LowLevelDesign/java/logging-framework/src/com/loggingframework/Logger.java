package com.loggingframework;

import com.loggingframework.entities.LogMessage;
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

    public String getName() {
        return this.name;
    }

    public Logger getParent() {
        return this.parent;
    }

    public void setLevel(LogLevel minLevel) {
        this.level = minLevel;
    }

    public void addAppender(LogAppender appender) {
        appenders.add(appender);
    }

    public List<LogAppender> getAppenders() {
        return appenders;
    }

    public LogLevel getEffectiveLevel() {
        Logger current = this;
        while (current != null) {
            if(current.level != null) {
                return current.level;
            }
            current = current.parent;
        }
        return LogLevel.DEBUG;
    }

    public void log(LogLevel messageLevel, String message) {
        if(messageLevel.isGreaterOrEqual(getEffectiveLevel())) {
            LogMessage logMessage = new LogMessage(messageLevel, this.name, message);
        }
    }

    public void info(String message) {
        log(LogLevel.INFO, message);
    }
}
