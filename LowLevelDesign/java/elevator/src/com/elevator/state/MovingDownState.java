package com.elevator.state;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;

public class MovingDownState implements ElevatorState {
    public void move(Elevator elevator) {
        if(!elevator.getUpRequests().isEmpty()) {
        } else if(!elevator.getDownRequests().isEmpty()) {

        }
    }

    public void addRequest(Elevator elevator, Request request) {

    }

    public Direction getDirection() {
        return Direction.IDLE;
    }
}
