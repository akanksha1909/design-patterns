package com.elevator.entities;

import com.elevator.enums.Direction;
import com.elevator.enums.RequestSource;

public class Request {
    private final int targetFloor;
    private final Direction direction;
    private final RequestSource source;

    public Request(int targetFloor, Direction direction, RequestSource requestSource) {
        this.targetFloor = targetFloor;
        this.direction = direction;
        this.source = requestSource;
    }


}
