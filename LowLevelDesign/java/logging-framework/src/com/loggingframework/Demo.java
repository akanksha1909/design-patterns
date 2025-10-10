package com.loggingframework;

import com.loggingframework.enums.LogLevel;
import com.loggingframework.strategies.appender.ConsoleAppender;

public class Demo {
    public static void main(String args[]) {
        LogManager logManager = LogManager.getInstance();
        Logger rootLogger = logManager.getRootLogger();
        rootLogger.setLevel(LogLevel.INFO); // Set global minimum level to info

        // Add a console appender to the root logger
        rootLogger.addAppender(new ConsoleAppender());

        System.out.println("----Initial Logging Demo------");
        Logger mainLogger = logManager.getLogger("com.example.Main");

        /*
        Logger Name: com Parent Name: root
        Logger Name: com.example Parent Name: com
        Logger Name: com.example.Main Parent Name: com.example
         */
        logManager.getLoggers();
        mainLogger.info("Application Starting up.");
    }
}
