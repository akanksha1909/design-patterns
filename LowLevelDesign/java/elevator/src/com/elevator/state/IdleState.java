package com.elevator.state;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;

public class IdleState implements ElevatorState {
    public void move(Elevator elevator) {
        if(!elevator.getUpRequests().isEmpty()) {
            elevator.setState(new MovingUpState());
        } else if(!elevator.getDownRequests().isEmpty()) {
            elevator.setState(new MovingDownState());
        }
    }

    public void addRequest(Elevator elevator, Request request) {

    }

    public Direction getDirection() {
        return Direction.IDLE;
    }
}
