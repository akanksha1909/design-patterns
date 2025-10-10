package com.elevator.observer;

import com.elevator.entities.Elevator;

public interface ElevatorObserver {
    void update(Elevator elevator);
}
