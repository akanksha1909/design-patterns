package com.moviebooking;

public class MovieBookingApplication {
    private static MovieBookingApplication instance;
    private SeatLockManager seatLockManager = SeatLockManager.getInstance();
    private BookingManager bookingManager = BookingManager.getInstance();
    private MovieBookingApplication(){

    }

    public static MovieBookingApplication getInstance() {
        if(MovieBookingApplication.instance == null) {
            MovieBookingApplication.instance = new MovieBookingApplication();
        }
        return MovieBookingApplication.instance;
    }

}
