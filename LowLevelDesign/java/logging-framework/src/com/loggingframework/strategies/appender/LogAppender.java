package com.loggingframework.strategies.appender;

import com.loggingframework.entities.LogMessage;
import com.loggingframework.strategies.formatter.LogFormatter;

public interface LogAppender {
    void append(LogMessage logMessage);
    void close();
    LogFormatter getFormatter();
    void setFormatter(LogFormatter formatter);
}
