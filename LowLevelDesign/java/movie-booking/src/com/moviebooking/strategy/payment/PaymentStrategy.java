package com.moviebooking.strategy.payment;

import com.moviebooking.entities.Payment;

public interface PaymentStrategy {
    Payment pay(double amount);
}
