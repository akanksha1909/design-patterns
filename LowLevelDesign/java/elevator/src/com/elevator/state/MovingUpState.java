package com.elevator.state;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;
import com.elevator.enums.RequestSource;

public class MovingUpState implements ElevatorState {
    public void move(Elevator elevator) {
        if(elevator.getUpRequests().isEmpty()) {
            elevator.setState(new IdleState());
            return;
        }
        Integer nextFloor = elevator.getUpRequests().first();
        elevator.setCurrentFloor(elevator.getCurrentFloor() + 1);
        if(elevator.getCurrentFloor() == nextFloor) {
            System.out.println("Elevator " + elevator.getId() + " stopped at floor " + nextFloor);
            elevator.getUpRequests().pollFirst();
        }

        if(elevator.getUpRequests().isEmpty()) {
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
        if(request.getDirection() == Direction.UP && request.getTargetFloor() >= elevator.getCurrentFloor()) {
            elevator.getUpRequests().add(request.getTargetFloor());
        } else if(request.getDirection() == Direction.DOWN) {
            elevator.getDownRequests().add(request.getTargetFloor());
        }
    }

    public Direction getDirection() {
        return Direction.UP;
    }
}
