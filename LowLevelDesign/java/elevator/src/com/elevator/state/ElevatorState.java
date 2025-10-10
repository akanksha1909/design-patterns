package com.elevator.state;

import com.elevator.ElevatorSystem;
import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;

public interface ElevatorState {
    void move(Elevator elevator);
    void addRequest(Elevator elevator, Request request);
    Direction getDirection();
}
