package com.fooddelivery;

import com.fooddelivery.assignmentStrategy.NearestAvailableAgentStrategy;
import com.fooddelivery.entities.*;
import com.fooddelivery.entities.MenuItem;
import com.fooddelivery.enums.OrderStatus;
import com.fooddelivery.search.SearchByCityStrategy;
import com.fooddelivery.search.SearchByMenuKeywordStrategy;
import com.fooddelivery.search.SearchByProximityStrategy;

import java.awt.*;
import java.util.List;
import java.util.Map;

public class Demo {
    public static void main(String args[]) {
        FoodDeliveryApplication service = FoodDeliveryApplication.getInstance();
        service.setAssignmentStrategy(new NearestAvailableAgentStrategy());

        Address aliceAddress = new Address("123 Maple St", "Springfield", "12345", 40.7128, -74.0060);

        Address pizzaAddress = new Address("456 Oak Ave", "Springfield", "12345", 40.7138, -74.0070);
        Address burgerAddress = new Address("789 Pine Ln", "Springfield", "12345", 40.7108, -74.0050);
        Address tacoAddress = new Address("101 Elm Ct", "Shelbyville", "54321", 41.7528, -75.0160);

        Customer alice = service.registerCustomer("Alice", "123456", aliceAddress);
        Restaurant pizzaPalace = service.registerRestaurant("Pizza Palace", pizzaAddress);
        Restaurant burgerBarn = service.registerRestaurant("Burger Barn", burgerAddress);
        Restaurant tacoTown = service.registerRestaurant("Taco Town", tacoAddress);

        Address bobAddress = new Address("1 B", "Springfield", "12345", 40.71, -74.00);
        service.registerDeliveryAgent("Bob", "123456789", bobAddress);

        pizzaPalace.addToItem(new MenuItem("P001", "Margherita Pizza", 12.99));
        pizzaPalace.addToItem(new MenuItem("P002", "Veggie Pizza", 11.99));
        burgerBarn.addToItem(new MenuItem("B001", "Classic Burger", 8.99));
        tacoTown.addToItem(new MenuItem("T001", "Crunchy Taco", 3.50));

        // Search By City
        System.out.println("Search By City");
        List<Restaurant> springFieldRestaurant = service.searchRestaurants(List.of(new SearchByCityStrategy("Springfield")));
        springFieldRestaurant.forEach(r -> System.out.println(" - " + r.getName()));

        // B. Search for restaurants near Alice
        System.out.println("Search for restaurants near Alice");
        List<Restaurant> restaurantsSearch = service.searchRestaurants(List.of(new SearchByProximityStrategy(aliceAddress, 0.01)));
        restaurantsSearch.forEach(r -> System.out.println(" -" + r.getName()));

        // (C) Search for restaurants that serve 'Pizza'
        System.out.println("Search for restaurants that serve 'Pizza'");
        List<Restaurant> pizzaRestaurants = service.searchRestaurants(List.of(new SearchByMenuKeywordStrategy("Pizza")));
        pizzaRestaurants.forEach(r -> System.out.println(" - " + r.getName()));

        System.out.println("Burger joints near Alice:");
        List<Restaurant> combinedSearch = service.searchRestaurants(List.of(new SearchByMenuKeywordStrategy("Burger"), new SearchByProximityStrategy(aliceAddress, 0.01)));
        combinedSearch.forEach(r -> System.out.println(" - " + r.getName()));

        System.out.println("Browsing a Menu");
        System.out.println("Menu for a Pizza Palace");

        Map<String, MenuItem> pizzaMenu = pizzaPalace.getItems();
        pizzaMenu.forEach((key, value) -> {
            System.out.printf("Menu item name is %s and price is %.2f%n", value.getName(), value.getPrice());
        });

        System.out.println("Alice places an order from a searched restaurant");
        if(!pizzaRestaurants.isEmpty()) {
            Restaurant chosenRestaurant = pizzaRestaurants.get(0);
            MenuItem chosenItem = chosenRestaurant.getItems().get("P001");

            var order = service.placeOrder(chosenRestaurant.getId(), List.of(new OrderItem(chosenItem, 1)), alice.getId());

            service.updateOrderStatus(order.getId(), OrderStatus.PREPARING);

            System.out.println("Order is ready for pickup");
            System.out.println("System will now find the nearest available delivery agent...");
            service.updateOrderStatus(order.getId(), OrderStatus.READY_FOR_PICKUP);

            System.out.println("Agent Delivers the order");
            service.updateOrderStatus(order.getId(), OrderStatus.DELIVERED);
        }
    }
}
