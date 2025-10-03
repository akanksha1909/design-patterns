package com.moviebooking;

public class SeatLockManager {
    private static SeatLockManager instance;
    private SeatLockManager(){

    }

    public static SeatLockManager getInstance() {
        if(SeatLockManager.instance == null) {
            SeatLockManager.instance = new SeatLockManager();
        }
        return SeatLockManager.instance;
    }
}
