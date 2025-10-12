package com.loggingframework.strategies.formatter;

import com.loggingframework.entities.LogMessage;

public interface LogFormatter {
    String format(LogMessage logMessage);
}
