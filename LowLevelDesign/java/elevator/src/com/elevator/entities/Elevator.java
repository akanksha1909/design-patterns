package com.elevator.entities;

import com.elevator.enums.Direction;
import com.elevator.state.ElevatorState;
import com.elevator.state.IdleState;

import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicInteger;

public class Elevator implements Runnable {
    private final Integer id;
    private AtomicInteger currentFloor;
    private final TreeSet<Integer> upRequests;
    private final TreeSet<Integer> downRequests;
    private ElevatorState state;

    public Elevator(int id) {
        this.id = id;
        this.currentFloor = new AtomicInteger(1);
        this.upRequests = new TreeSet<>();
        this.downRequests = new TreeSet<>();
        this.state = new IdleState();
    }

    public TreeSet<Integer> getUpRequests() {
        return this.upRequests;
    }

    public TreeSet<Integer> getDownRequests() {
        return this.downRequests;
    }

    public Integer getId() {
        return this.id;
    }

    public int getCurrentFloor() {
        return this.currentFloor.get();
    }

    public Direction getDirection() {
        return this.state.getDirection();
    }

    public void setState(ElevatorState state) {
        this.state = state;
    }

    public void run() {

    }
}
