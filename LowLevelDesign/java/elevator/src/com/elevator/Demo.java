package com.elevator;

import com.elevator.enums.Direction;

public class Demo {
    // throws InterruptedException i
    public static void main(String args[]) throws InterruptedException {
        int numElevators = 2;
        ElevatorSystem elevatorSystem = ElevatorSystem.getInstance(numElevators);

        elevatorSystem.start();
        System.out.println("Elevator system started. ConsoleDisplay is observing.\n");

        // ---- SIMULATION START -------
        // 1. External Request: User at floor 5 wants to go UP
        // The system will dispatch this to nearest elevator (Likely E1 or E2, both at floor 1)
        elevatorSystem.requestElevator(5, Direction.UP);
        Thread.sleep(1000);


        // 2. Internal Request: Assume E1 took the previous request.
        // The users gets in at floor 5 and presses 10.
        // We send this request directly at E1.

        elevatorSystem.selectFloor(1, 10);
        Thread.sleep(1000);

        // 3. External Request: User at floor 3 wants to go down
        // E2 (likely still idle at floor 1) might take this, or E1 if it's convenient
//        elevatorSystem.requestElevator(3, Direction.DOWN);
//        Thread.sleep(3000);
//
//        // 4. Internal Request: User in E2 presses 1
//        elevatorSystem.selectFloor(2, 1);

        // Let the simulation run for a while to observe the display updates
        System.out.println("\n ---- Letting simulation run for 1 second ----");
        Thread.sleep(10000);

        elevatorSystem.shutdown();
        System.out.println("\n --- SIMULATION END----");
    }
}
