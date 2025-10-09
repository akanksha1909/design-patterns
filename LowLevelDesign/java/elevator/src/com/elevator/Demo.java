package com.elevator;

public class Demo {
    public static void main(String args[]) {
        int numElevators = 2;
        ElevatorSystem elevatorSystem = ElevatorSystem.getInstance(numElevators);

        elevatorSystem.start();
    }
}
