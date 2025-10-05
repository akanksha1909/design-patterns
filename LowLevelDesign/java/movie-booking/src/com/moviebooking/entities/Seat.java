package com.moviebooking.entities;

import com.moviebooking.enums.SeatStatus;
import com.moviebooking.enums.SeatType;

import java.util.UUID;

public class Seat {
    private final String id;
    private final Integer row;
    private final Integer col;
    private final SeatType seatType;
    private SeatStatus seatStatus;
    public Seat(Integer row, Integer col, SeatType seatType) {
        this.id = UUID.randomUUID().toString();
        this.row = row;
        this.col = col;
        this.seatType = seatType;
        this.seatStatus = SeatStatus.AVAILABLE;
    }

    public String getId() {
        return this.id;
    }

    public SeatStatus getSeatStatus() {
        return this.seatStatus;
    }
    public Integer getRow() {
        return this.row;
    }

    public Integer getCol(){
        return this.col;
    }

    public SeatType getSeatType() {
        return this.seatType;
    }

    public void setSeatStatus(SeatStatus seatStatus) {
        this.seatStatus = seatStatus;
    }
}
