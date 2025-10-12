package com.loggingframework.strategies.appender;

import com.loggingframework.entities.LogMessage;
import com.loggingframework.strategies.formatter.LogFormatter;
import com.loggingframework.strategies.formatter.SimpleTextFormatter;

import java.io.FileWriter;
import java.io.IOException;

public class FileAppender implements LogAppender {
    private LogFormatter formatter;
    private FileWriter writer;

    public FileAppender(String filePath) {
        this.formatter = new SimpleTextFormatter();
        try {
            this.writer = new FileWriter(filePath, true);
        } catch(Exception e) {
            System.out.println("Failed to create writer for file logs, exception: " + e.getMessage());
        }
    }

    @Override
    public synchronized void append(LogMessage logMessage) {
        try {
            writer.write(formatter.format(logMessage) + "\n");
            writer.flush();
        } catch (IOException e) {
            System.out.println("Failed to write logs to file, exception: " + e.getMessage());
        }
    }

    @Override
    public void close() {
        try {
            writer.close();
        } catch (IOException e) {
            System.out.println("Failed to close logs file, exception: " + e.getMessage());
        }
    }

    @Override
    public void setFormatter(LogFormatter logFormatter) {
        this.formatter = formatter;
    }

    @Override
    public LogFormatter getFormatter() {
        return formatter;
    }
}
