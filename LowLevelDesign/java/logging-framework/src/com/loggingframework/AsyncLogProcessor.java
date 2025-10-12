import com.loggingframework.entities.LogMessage;
import com.loggingframework.strategies.appender.LogAppender;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AsyncLogProcessor {
    private final ExecutorService executor;

    public AsyncLogProcessor() {
        // This constructor creates an asynchronous log processor that runs tasks in a background thread.
        this.executor = Executors.newSingleThreadExecutor(runnable -> {
            Thread thread = new Thread(runnable, "AsyncLogProcessor");
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
}
