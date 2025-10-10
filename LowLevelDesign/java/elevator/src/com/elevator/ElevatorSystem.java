package com.elevator;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;
import com.elevator.enums.Direction;
import com.elevator.enums.RequestSource;
import com.elevator.observer.Display;
import com.elevator.strategy.ElevatorSelectionStrategy;
import com.elevator.strategy.NearestElevatorStrategy;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ElevatorSystem {
    private static ElevatorSystem instance;
    private final ExecutorService executorService;
    private final Map<Integer, Elevator> elevators = new HashMap<>();
    private final ElevatorSelectionStrategy selectionStrategy;

    private ElevatorSystem(int numElevators){
        this.executorService = Executors.newFixedThreadPool(numElevators);
        this.selectionStrategy = new NearestElevatorStrategy();

        Display display = new Display();
        for(int i=1; i<=numElevators; i++) {
            Elevator elevator = new Elevator(i);
            this.elevators.put(elevator.getId(), elevator);
            elevator.addObserver(display);
        }
    }

    public static synchronized ElevatorSystem getInstance(int numElevators) {
        if(instance == null) {
            instance = new ElevatorSystem(numElevators);
        }
        return instance;
    }

    public void start() {
        for(Elevator elevator: this.elevators.values()) {
            /*
             * executorService is an instance of ExecutorService, which manages a pool of threads.
             * submit() tells the executor to run the given task (elevator) on a background thread.
             */
            this.executorService.submit(elevator);
        }
    }

    // External Request
    public void requestElevator(int floor, Direction direction) {
        System.out.println("EXTERNAL Request: User at floor " + floor + " wants to go " + direction);
        Request request = new Request(floor, direction, RequestSource.EXTERNAL);
        Optional<Elevator> selectedElevator = selectionStrategy.selectElevator(new ArrayList<>(elevators.values()), request);
        if(selectedElevator.isPresent()) {
            selectedElevator.get().addRequest(request);
        } else {
            System.out.println("System busy, please wait.");
        }
    }

    // Internal Request (Cabin call)
    public void selectFloor(int elevatorId, int destinationFloor) {
        System.out.println("Internal Request: User in Elevator " + elevatorId + " selected floor " + destinationFloor);
        Request request = new Request(destinationFloor, Direction.IDLE, RequestSource.INTERNAL);

        Elevator elevator = elevators.get(elevatorId);
        if(elevator != null) {
            elevator.addRequest(request);
        } else {
            System.out.println("Invalid Elevator Id");
        }
    }

    public void shutdown() {
        System.out.println("Shutting down elevator system ...");
        for(Elevator elevator: elevators.values()) {
            elevator.stopElevator();
        }
        executorService.shutdown();
    }

}
