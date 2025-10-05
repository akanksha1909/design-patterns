package com.moviebooking.strategy.pricing;

import com.moviebooking.entities.Seat;

import java.util.List;

public class WeekendPricingStrategy implements PricingStrategy {
    private static final double WEEKEND_SURCHARGE = 1.2;

    public double calculateAmount(List<Seat> seats) {
        double amount = 0;
        for (Seat seat: seats) {
            amount += seat.getSeatType().getPrice();
        }
        return amount * WEEKEND_SURCHARGE;
    }
}
