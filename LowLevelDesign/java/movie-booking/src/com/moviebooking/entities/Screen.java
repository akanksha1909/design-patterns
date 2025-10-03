package com.moviebooking.entities;

import java.util.ArrayList;
import java.util.UUID;

public class Screen {
    private final String id;
    private final String name;
    private final Cinema cinema;
    private final List<Seat> seats;
    public Screen(String name, Cinema cinema) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.cinema = cinema;
        this.seats = new ArrayList<>();
    }

    public void addSeat(Seat seat) {

    }
}
