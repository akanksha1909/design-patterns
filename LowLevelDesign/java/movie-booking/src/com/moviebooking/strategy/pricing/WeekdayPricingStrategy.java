package com.moviebooking.strategy.pricing;

import com.moviebooking.entities.Seat;

import java.util.List;

public class WeekdayPricingStrategy implements PricingStrategy {
    public double calculateAmount(List<Seat> seats) {
        double amount = 0;
        for (Seat seat: seats) {
            amount += seat.getSeatType().getPrice();
        }
        return amount;
    }
}
