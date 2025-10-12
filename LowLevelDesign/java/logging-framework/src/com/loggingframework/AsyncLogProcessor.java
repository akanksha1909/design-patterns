package com.loggingframework;

import com.loggingframework.entities.LogMessage;
import com.loggingframework.strategies.appender.LogAppender;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class AsyncLogProcessor {
    private final ExecutorService executor;

    public AsyncLogProcessor() {
        // This constructor creates an asynchronous log processor that runs tasks in a background thread.
        this.executor = Executors.newSingleThreadExecutor(runnable -> {
            Thread thread = new Thread(runnable, "com.loggingframework.AsyncLogProcessor");
            /*
            If the JVM exits, daemon threads stop immediately, without finishing their work —
so never use them for tasks that must complete (like writing to a file or saving data).
             */
            thread.setDaemon(true); // Don't prevent JVM exit
            return thread;
        });
    }

    public void process(LogMessage logMessage, List<LogAppender> appenders) {
        if(executor.isShutdown()) {
            System.err.println("Logger is shut down. Cant process log message");
            return;
        }

        // Submit a new task to the executor
        executor.submit(() -> {
           for (LogAppender appender: appenders) {
               appender.append(logMessage);
           }
        });
    }

    public void stop() {
        // Disable new tasks from being submitted
        executor.shutdown();
        try {
            if(!executor.awaitTermination(2, TimeUnit.SECONDS)) {
                System.err.println("Logger executor did not terminate in the specified time.");
                // Forcibly shutdown by still running tasks
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            // Preserve interrupt status
            Thread.currentThread().interrupt();
        }
    }
}
