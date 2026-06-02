package com.fooddelivery.assignmentStrategy;

import com.fooddelivery.entities.DeliveryAgent;
import com.fooddelivery.entities.Order;

import java.util.List;
import java.util.Optional;

public interface DeliveryAssignmentStrategy {
    Optional<DeliveryAgent> findAgent(Order order, List<DeliveryAgent> agents);
}
