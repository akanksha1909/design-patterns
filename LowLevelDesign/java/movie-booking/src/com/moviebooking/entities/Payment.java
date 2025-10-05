package com.moviebooking.entities;

import com.moviebooking.enums.PaymentStatus;

import java.util.UUID;

public class Payment {
    private final String id;
    private final double amount;
    private final PaymentStatus status;
    private final String transactionId;
    public Payment(double amount, PaymentStatus paymentStatus, String transactionId) {
        this.id = UUID.randomUUID().toString();
        this.amount = amount;
        this.status = paymentStatus;
        this.transactionId = transactionId;
    }

    public PaymentStatus getPaymentStatus(){
        return this.status;
    }
}
