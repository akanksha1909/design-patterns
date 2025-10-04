package com.moviebooking;

import com.moviebooking.entities.Seat;
import com.moviebooking.entities.Show;
import com.moviebooking.entities.User;
import com.moviebooking.enums.SeatStatus;

import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

public class SeatLockManager {
    private static SeatLockManager instance;
    /***
     * lockedSeats = {
     *     Show(A): {
     *         Seat(A1): "alice",
     *         Seat(A2): "bob
     *     }
     *  }
     */
    private final Map<Show, Map<Seat, String>> lockedSeats = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Integer LOCK_TIMEOUT_MS = 500;
    private SeatLockManager(){

    }

    public static SeatLockManager getInstance() {
        if(SeatLockManager.instance == null) {
            SeatLockManager.instance = new SeatLockManager();
        }
        return SeatLockManager.instance;
    }

    public void lockSeats(User user, Show show, List<Seat> seats) {
       synchronized (show) {
           seats.forEach(seat -> {
               if(seat.getSeatStatus() != SeatStatus.AVAILABLE) {
                   System.out.println("Seat " + seat.getId() + " is not available.");
                   return;
               }
           });

           // Lock the seats
           seats.forEach(seat -> seat.setSeatStatus(SeatStatus.LOCKED));
           lockedSeats.computeIfAbsent(show, k -> new ConcurrentHashMap<>());
           seats.forEach(seat -> lockedSeats.get(show).put(seat, user.getId()));

           // Schedule a task to unlock the seats after a timeout
           scheduler.schedule(() -> unlockSeats(user, show, seats), LOCK_TIMEOUT_MS, TimeUnit.MILLISECONDS);
           System.out.println("Locked seats: " + seats.stream().map(Seat::getId).toList() + " for user " + user.getName());
       }
    }

    public void unlockSeats(User user, Show show, List<Seat> seats){

    }

    public void shutdown() {
        scheduler.shutdown();
    }
}
