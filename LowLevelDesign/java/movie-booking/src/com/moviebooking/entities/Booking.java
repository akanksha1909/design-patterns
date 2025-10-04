package com.moviebooking.entities;

import com.moviebooking.enums.SeatStatus;

import java.util.List;

public class Booking {
    private final String id;
    private final User user;
    private final Show show;
    private final List<Seat> seats;
    private final double totalAmount;
    private Booking(String id, User user, Show show, List<Seat> seats, double totalAmount) {
        this.id = id;
        this.user = user;
        this.show = show;
        this.seats = seats;
        this.totalAmount = totalAmount;
    }

    public void confirmBooking() {
        for (Seat seat: seats) {
            seat.setSeatStatus(SeatStatus.BOOKED);
        }
    }

    public double getTotalAmount() {
        return this.totalAmount;
    }

    public static class BookingBuilder {
        private String id;
        private User user;
        private Show show;
        private List<Seat> seats;
        private double totalAmount;
        public BookingBuilder setId(String id) {
            this.id = id;
            return this;
        }

        public BookingBuilder setUser(User user) {
            this.user = user;
            return this;
        }

        public BookingBuilder setShow(Show show) {
            this.show = show;
            return this;
        }

        public BookingBuilder setSeats(List<Seat> seats) {
            this.seats = seats;
            return this;
        }

        public BookingBuilder setTotalAmount(double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Booking build() {
            return new Booking(id, user, show, seats, totalAmount);
        }
    }
}
