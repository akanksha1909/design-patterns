package com.moviebooking;

public class BookingManager {
    private static BookingManager instance;
    private Map<String, Booking> bookings;
    private BookingManager(){

    }

    public static BookingManager getInstance() {
        if(BookingManager.instance == null) {
            BookingManager.instance = new BookingManager();
        }
        return BookingManager.instance;
    }
}
