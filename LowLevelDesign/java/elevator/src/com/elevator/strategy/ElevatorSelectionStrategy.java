package com.elevator.strategy;

import com.elevator.entities.Elevator;
import com.elevator.entities.Request;

import java.util.List;
import java.util.Optional;

public interface ElevatorSelectionStrategy {
    Optional<Elevator> selectElevator(List<Elevator> elevators, Request request);
}
