package com.elevator;

import com.elevator.entities.Elevator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ElevatorSystem {
    private static ElevatorSystem instance;
    private final ExecutorService executorService;
    private final Map<Integer, Elevator> elevators = new HashMap<>();
    private ElevatorSystem(int numElevators){
        this.executorService = Executors.newFixedThreadPool(numElevators);

        List<Elevator> elevatorList = new ArrayList<>();
        for(int i=0;i<numElevators;i++) {
            Elevator elevator = new Elevator(i);
            elevatorList.add(elevator);
        }

        for(Elevator elevator: elevatorList) {
            this.elevators.put(elevator.getId(), elevator);
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

}
