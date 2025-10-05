package com.moviebooking.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Screen {
    private final String id;
    private final String name;
    private List<Seat> seats;
    private Cinema cinema;
    public Screen(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.seats = new ArrayList<>();
    }

    public void addSeat(Seat seat) {
        this.seats.add(seat);
    }

    public void addCinema(Cinema cinema) {
        this.cinema = cinema;
    }

    public Cinema getCinema() {
        return this.cinema;
    }

    public List<Seat> getSeats() {
        return this.seats;
    }
}
