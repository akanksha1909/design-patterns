package com.elevator.entities;

import com.elevator.enums.Direction;
import com.elevator.observer.ElevatorObserver;
import com.elevator.state.ElevatorState;
import com.elevator.state.IdleState;

import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicInteger;

public class Elevator implements Runnable {
    private final Integer id;
    private AtomicInteger currentFloor;
    private final TreeSet<Integer> upRequests;
    private final TreeSet<Integer> downRequests;
    private ElevatorState state;
    /*
    “This variable’s value might be changed by multiple threads.”
    So, whenever a thread reads a volatile variable,
    it always reads the most recent value written by any other thread —
    directly from main memory, not from the thread’s local cache.
    */
    private volatile boolean isRunning = true;
    private final List<ElevatorObserver> observers = new ArrayList<>();

    public Elevator(int id) {
        this.id = id;
        this.currentFloor = new AtomicInteger(1);
        this.upRequests = new TreeSet<>();
        this.downRequests = new TreeSet<>((a, b) -> b - a);
        this.state = new IdleState();
    }

    public void addObserver(ElevatorObserver observer) {
        observers.add(observer);
        observer.update(this);
    }

    public void notifyObservers() {
        for(ElevatorObserver observer: observers) {
            observer.update(this);
        }
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
        notifyObservers(); // Notify observers on direction change
    }

    public void setCurrentFloor(int floor) {
        this.currentFloor.set(floor);
        notifyObservers();
    }

    public synchronized void addRequest(Request request) {
        System.out.println("Elevator " + id + " processing: " + request);
        state.addRequest(this, request);
    }

    public void move() {
        state.move(this);
    }

    public void stopElevator() {
        this.isRunning = false;
    }

    @Override
    public void run() {
        while(isRunning) {
           move();
           try {
               Thread.sleep(1000);
           } catch(InterruptedException e) {
               Thread.currentThread().interrupt();
               isRunning = false;
           }
        }
    }
}
