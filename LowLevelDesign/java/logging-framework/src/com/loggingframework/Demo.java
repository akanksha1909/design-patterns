package com.loggingframework;

import com.loggingframework.enums.LogLevel;
import com.loggingframework.strategies.appender.ConsoleAppender;
import com.loggingframework.strategies.appender.FileAppender;

public class Demo {
    public static void main(String args[]) {
        LogManager logManager = LogManager.getInstance();
        Logger rootLogger = logManager.getRootLogger();
        rootLogger.setLevel(LogLevel.INFO); // Set global minimum level to info

        // Add a console appender to the root logger
        rootLogger.addAppender(new ConsoleAppender());
        rootLogger.addAppender(new FileAppender("/Users/anshuman/Documents/Akanksha/design-patterns/logfile"));

        System.out.println("----Initial Logging Demo------");
        Logger mainLogger = logManager.getLogger("com.example.Main");

        /*
        Logger Name: com Parent Name: root
        Logger Name: com.example Parent Name: com
        Logger Name: com.example.Main Parent Name: com.example
         */
        logManager.getLoggers();
        mainLogger.info("Application Starting up.");
        mainLogger.debug("This is a debug message, it should not appear."); // Below root level
        mainLogger.warn("This is a warning message");

        // -- 2. Hierarchy and Additivity Demo ---
        System.out.println("\n ---- Logger Hierarchy demo -----");
        Logger dbLogger = logManager.getLogger("com.example.db");

        // dbLogger inherits level and appenders from root
        dbLogger.info("Database connection pool intialising");

        // Lets create a more specific logger and override its level
        Logger serviceLogger = logManager.getLogger("com.example.service.UserService");
        serviceLogger.setLevel(LogLevel.DEBUG);
        serviceLogger.info("User service starting.");
        serviceLogger.debug("This debug message SHOULD now appear for the service logger");

        // --- 3. Dynamic Configuration change ----
        System.out.println("\n --- Dynamic Configuration Demo -----");
        System.out.println("Changing too log level to DEBUG");
        rootLogger.setLevel(LogLevel.DEBUG);
        mainLogger.debug("This debug message should now be visible");
        /*
            The logger doesn’t print immediately —
            it submits those log messages to an AsyncLogProcessor (running on a background daemon thread).

            The main thread then keeps running — and quickly reaches the end of main().
            ➡️ Only daemon threads (your AsyncLogProcessor) remain.
            ➡️ The JVM immediately shuts down, killing the daemon thread before it gets a chance to print logs.

            So your logs never appear, because the background thread dies before it flushes them.
            ✅ Why adding Thread.sleep(500) fixes it

            When you add a short sleep:

            Thread.sleep(500);
            you’re giving the daemon log thread a bit of time to:
            pick up the log messages from its queue, and
            print them to the console before the JVM exits.
            So the print statements show up.
         */
        try {
            Thread.sleep(1000);
            logManager.shutdown();
        } catch (Exception e) {
            System.out.println("Caught exception");
        }
    }
}
