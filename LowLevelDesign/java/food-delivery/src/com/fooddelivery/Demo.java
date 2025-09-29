package com.fooddelivery;

import com.fooddelivery.entities.*;
import com.fooddelivery.strategies.search.RestaurantSearchStrategy;
import com.fooddelivery.strategies.search.SearchByCityStrategy;

import java.util.ArrayList;
import java.util.List;

public class Demo {
    public static void main(String args[]) {
        FoodDeliveryApp service = FoodDeliveryApp.getInstance();

        Address aliceAddress = new Address("123 Maple St", "Springfield", "12345", 40.7128, -74.0060);
        Address pizzaAddress = new Address("456 Oak St", "Springfield", "12345", 40.7138, -74.0070);
        Address burgerAddress = new Address("789 Pine St", "Springfield", "12345", 40.7108, -74.0050);
        Address tacoAddress = new Address("101 Elm St", "ShelByville", "54321", 41.7528, -75.0160);

        Customer alice = service.registerCustomer("Alice", "1234567", aliceAddress);
        Restaurant pizzaPalace = service.registerRestaurant("Pizza Palace", pizzaAddress);
        Restaurant burgerBarn = service.registerRestaurant("Burger Barn", burgerAddress);
        Restaurant tacoBell = service.registerRestaurant("Taco Bell", tacoAddress);
        service.registerDeliveryAgent("Bob", "1234567", new Address("1 B", "SpringField", "12345", 40.71, -74.00));

        pizzaPalace.addFoodItem(new FoodItem("Margherita Pizza", 12.99));
        pizzaPalace.addFoodItem(new FoodItem("Veggie Pizza", 11.99));
        burgerBarn.addFoodItem(new FoodItem("Classic Burger", 8.99));
        tacoBell.addFoodItem(new FoodItem("Crunchy Taco", 3.50));

        RestaurantSearchStrategy searchStrategy = new SearchByCityStrategy("SpringField");
        List<Restaurant> springFieldRestaurants = service.searchRestaurant(searchStrategy);
        List<String> names = new ArrayList<>();
        springFieldRestaurants.forEach(restaurant -> names.add(restaurant.getName()));
        System.out.println("Restaurant names " + names);

        FoodItem itemToOrder = null;
        for (FoodItem item : pizzaPalace.getFoodItem()) {
            if (item.getName().equalsIgnoreCase("Margherita Pizza")) {
                itemToOrder = item;
                break;
            }
        }
        Order aliceOrder = service.createOrder(alice, pizzaPalace.getId(), List.of(new OrderItem(itemToOrder, 1, itemToOrder.getName(), itemToOrder.getPrice())));
        System.out.println("Order placed" + aliceOrder);
    }
}
