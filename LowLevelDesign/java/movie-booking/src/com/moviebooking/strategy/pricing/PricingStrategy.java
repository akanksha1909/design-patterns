package com.moviebooking.strategy.pricing;

import com.moviebooking.entities.Seat;

import java.util.List;

public interface PricingStrategy {
    double calculateAmount(List<Seat> seats);
}
