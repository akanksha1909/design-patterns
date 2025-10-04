package com.moviebooking;

import com.moviebooking.entities.Seat;
import com.moviebooking.entities.Show;
import com.moviebooking.entities.User;
import com.moviebooking.entities.Booking;

import java.util.List;
import java.util.Map;
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

    public Booking createBooking(User user, Show show, List<Seat> seats) {
           this.seatLockManager.lockSeats(user, show, seats);
           Booking booking = new Booking.BookingBuilder()
                   .setId(UUID.randomUUID().toString())
                   .setUser(user)
                   .setShow(show)
                   .setSeats(seats)
                   .build();
           return booking;

    }
}
