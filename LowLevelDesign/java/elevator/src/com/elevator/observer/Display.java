package com.elevator.observer;

import com.elevator.entities.Elevator;

public class Display implements ElevatorObserver {
    public void update(Elevator elevator) {
        System.out.println("[Display] Elevator " + elevator.getId() + " | Current Floor: " +
                elevator.getCurrentFloor() + " | Direction: " + elevator.getDirection());
    }
}
