package com.moviebooking.strategy.payment;

import com.moviebooking.entities.Payment;
import com.moviebooking.enums.PaymentStatus;

import java.util.UUID;

public class CreditCardStrategy implements PaymentStrategy {
    private final String cardNumber;
    private final String cvv;
    public CreditCardStrategy(String cardNumber, String cvv){
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }

    @Override
    public Payment pay(double amount) {
        Payment payment = new Payment(amount, PaymentStatus.SUCCESS, "TXN_" + UUID.randomUUID());
        return payment;
    }
}
