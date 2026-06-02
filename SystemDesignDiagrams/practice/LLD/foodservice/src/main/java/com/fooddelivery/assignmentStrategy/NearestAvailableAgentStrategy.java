package com.fooddelivery.assignmentStrategy;

import com.fooddelivery.entities.Address;
import com.fooddelivery.entities.DeliveryAgent;
import com.fooddelivery.entities.Order;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class NearestAvailableAgentStrategy implements DeliveryAssignmentStrategy {

    public Optional<DeliveryAgent> findAgent(Order order, List<DeliveryAgent> agents) {
        Address restaurantAddress = order.getRestaurant().getAddress();
        Address customerAddress = order.getCustomer().getAddress();
        return agents.stream().filter(DeliveryAgent::isAvailable).min(Comparator.comparingDouble(agent -> calculateTotalDistance(agent, restaurantAddress, customerAddress)));
    }

    private double calculateTotalDistance(DeliveryAgent agent, Address restaurantAddress, Address customerAddress) {
        double agentToRestaurantDist = agent.getCurrentLocation().distanceTo(restaurantAddress);
        double restaurantToCustomerDist =  restaurantAddress.distanceTo(customerAddress);
        return agentToRestaurantDist + restaurantToCustomerDist;
    }
}
