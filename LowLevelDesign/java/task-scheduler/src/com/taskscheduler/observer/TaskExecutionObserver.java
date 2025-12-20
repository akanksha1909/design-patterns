package com.taskscheduler.observer;

import com.taskscheduler.ScheduledTask;

public interface TaskExecutionObserver {
    void onTaskStarted(ScheduledTask task);
    void onTaskCompleted(ScheduledTask task);
    void onTaskFailed(ScheduledTask task, Exception e);
}
