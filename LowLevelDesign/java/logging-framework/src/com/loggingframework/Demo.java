package com.loggingframework;

import com.loggingframework.enums.LogLevel;

public class Demo {
    public static void main(String args[]) {
        LogManager logManager = LogManager.getInstance();
        Logger rootLogger = logManager.getRootLogger();
        rootLogger.setLevel(LogLevel.INFO); // Set global minimum level to info

        // Add a console appender to the root logger
    }
}
