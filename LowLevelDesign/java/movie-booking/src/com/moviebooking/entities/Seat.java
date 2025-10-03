package com.moviebooking.entities;

import java.util.UUID;

public class Seat {
    public Seat(Screen screen, Integer row, Integer col, SeatType seatType) {
        this.id = UUID.randomUUID().toString();
        this.screen = screen;
        this.row = row;
        this.col = col;
        this.seatType = seatType;
        this.seatStatus = seatStatus;
    }
}
