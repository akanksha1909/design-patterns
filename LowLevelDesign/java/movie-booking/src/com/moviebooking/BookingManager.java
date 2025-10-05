package com.moviebooking;

import com.moviebooking.entities.*;
import com.moviebooking.enums.PaymentStatus;
import com.moviebooking.strategy.payment.PaymentStrategy;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class BookingManager {
    private static BookingManager instance;
    private Map<String, Booking> bookings;
    private final SeatLockManager seatLockManager = SeatLockManager.getInstance();
    private BookingManager(){
    }

    public static BookingManager getInstance() {
        if(BookingManager.instance == null) {
            BookingManager.instance = new BookingManager();
        }
        return BookingManager.instance;
    }

    public Optional<Booking> createBooking(User user, Show show, List<Seat> seats, PaymentStrategy paymentStrategy) {
           this.seatLockManager.lockSeats(user, show, seats);
           double totalAmount = show.getPricingStrategy().calculateAmount(seats);

           Payment payment = paymentStrategy.pay(totalAmount);
           if(payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
               Booking booking = new Booking.BookingBuilder()
                       .setId(UUID.randomUUID().toString())
                       .setUser(user)
                       .setShow(show)
                       .setSeats(seats)
                       .setTotalAmount(totalAmount)
                       .build();

               booking.confirmBooking();
               seatLockManager.unlockSeats(user, show, seats);
               return Optional.of(booking);
           } else {
               System.out.println("Payment Failed");
               return Optional.empty();
           }
    }
}
