package com.elevator.state;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;

public class MovingUpState implements ElevatorState {
    public void move(Elevator elevator) {
        if(elevator.getUpRequests().isEmpty()) {
            elevator.setState(new IdleState());
            return;
        }
    }

    public void addRequest(Elevator elevator, Request request) {

    }

    public Direction getDirection() {
        return Direction.IDLE;
    }
}
