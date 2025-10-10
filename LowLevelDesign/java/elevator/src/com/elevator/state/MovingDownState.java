package com.elevator.state;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;
import com.elevator.enums.RequestSource;

public class MovingDownState implements ElevatorState {
    public void move(Elevator elevator) {
        if(elevator.getDownRequests().isEmpty()) {
            elevator.setState(new IdleState());
            return;
        }
        Integer nextFloor = elevator.getDownRequests().first();
        elevator.setCurrentFloor(elevator.getCurrentFloor() - 1);

        if(elevator.getCurrentFloor() == nextFloor) {
            elevator.getDownRequests().pollFirst();
        }
        if(elevator.getDownRequests().isEmpty()) {
            elevator.setState(new IdleState());
        }
    }

    public void addRequest(Elevator elevator, Request request) {
        // Internal requests always get added to the appropriate queue
        if(request.getSource() == RequestSource.INTERNAL) {
            if(request.getTargetFloor() > elevator.getCurrentFloor()) {
                elevator.getUpRequests().add(request.getTargetFloor());
            } else {
                elevator.getDownRequests().add(request.getTargetFloor());
            }
            return;
        }

        // External requests
        if(request.getDirection() == Direction.DOWN && request.getTargetFloor() <= elevator.getCurrentFloor()) {
            elevator.getDownRequests().add(request.getTargetFloor());
        } else if (request.getDirection() == Direction.UP) {
            elevator.getUpRequests().add(request.getTargetFloor());
        }
    }

    public Direction getDirection() {
        return Direction.DOWN;
    }
}
