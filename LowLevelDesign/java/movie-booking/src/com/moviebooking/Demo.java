package com.moviebooking;

import com.moviebooking.entities.*;
import com.moviebooking.enums.SeatStatus;
import com.moviebooking.enums.SeatType;
import com.moviebooking.strategy.payment.CreditCardStrategy;
import com.moviebooking.strategy.payment.PaymentStrategy;
import com.moviebooking.strategy.pricing.WeekdayPricingStrategy;
import com.moviebooking.strategy.pricing.WeekendPricingStrategy;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class Demo {
    public static void main(String args[]) {
        MovieBookingApplication service = MovieBookingApplication.getInstance();
        City city = service.addCity("Bangalore");

        Screen screenOne = new Screen("S1");
        for(int i=0;i<10;i++){
            screenOne.addSeat(new Seat(1, i, i < 5 ? SeatType.REGULAR: SeatType.PREMIUM));
            screenOne.addSeat(new Seat(2, i,  i < 5 ? SeatType.REGULAR: SeatType.RECLINER));
        }

        Cinema pallasio = service.addCinema("cinema1", city, List.of(screenOne));
        screenOne.addCinema(pallasio);

        Movie matrix = service.addMovie("The Matrix", 120);
        Movie avengers = service.addMovie("Avengers: Endgame", 120);

        service.createShow(matrix, screenOne, LocalDateTime.now().plusHours(2), new WeekdayPricingStrategy());
        service.createShow(avengers, screenOne, LocalDateTime.now().plusHours(10), new WeekendPricingStrategy());

        User alice = service.createUser("Alice", "alice@example.com");

        matrix.addObserver(alice);
        matrix.notifyObservers(matrix);

        String movieTitle = "Avengers: Endgame";
        String cityName = "Bangalore";
        List<Show> availableShows = service.findShows(movieTitle, cityName);
        if(availableShows.isEmpty()) {
            System.out.println("No shows found for " + movieTitle + "in " + cityName);
            return;
        }
        Show selectedShow = availableShows.get(0);
        List<Seat> availableSeats = selectedShow.getScreen().getSeats()
                .stream().filter(seat -> seat.getSeatStatus() == SeatStatus.AVAILABLE)
                .toList();

        List<Seat> desiredSeats = List.of(availableSeats.get(9), availableSeats.get(12));
        desiredSeats.forEach(seat -> {
            System.out.println("Seats " + seat.getSeatType());
        });

        PaymentStrategy creditCardPayment = new CreditCardStrategy("123-456-789", "123");
        Optional<Booking> movieBooking = service.bookTickets(alice.getId(), selectedShow.getId(), desiredSeats, creditCardPayment);
        if(movieBooking.isPresent()) {
            System.out.println("Total booking amount " + movieBooking.get().getTotalAmount());
        }

        service.shutdown();
    }
}
