package com.moviebooking;

import com.moviebooking.entities.*;
import com.moviebooking.enums.SeatType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MovieBookingApplication {
    private static MovieBookingApplication instance;
    private SeatLockManager seatLockManager = SeatLockManager.getInstance();
    private BookingManager bookingManager = BookingManager.getInstance();
    private Map<String, City> cities;
    private Map<String, Movie> movies;
    private Map<String, Cinema> cinemas;
    private Map<String, User> users;
    private Map<String, Show> shows;
    private MovieBookingApplication(){
        this.cities = new ConcurrentHashMap<>();
        this.movies = new ConcurrentHashMap<>();
        this.cinemas = new ConcurrentHashMap<>();
        this.users = new ConcurrentHashMap<>();
        this.shows = new ConcurrentHashMap<>();
    }

    public static MovieBookingApplication getInstance() {
        if(MovieBookingApplication.instance == null) {
            MovieBookingApplication.instance = new MovieBookingApplication();
        }
        return MovieBookingApplication.instance;
    }

    public City addCity(String name) {
        City city = new City(name);
        this.cities.put(city.getId(), city);
        return city;
    }

    public Cinema addCinema(String name, City city, List<Screen> screen) {
        Cinema cinema = new Cinema(name, city, screen);
        this.cinemas.put(cinema.getId(), cinema);
        return cinema;
    }

    public Movie addMovie(String name, Integer duration) {
        Movie movie = new Movie(name, duration);
        this.movies.put(movie.getId(), movie);
        return movie;
    }

    public Show createShow(Movie movie, Screen screen, LocalDateTime startTime) {
        Show show = new Show(movie, screen, startTime);
        this.shows.put(show.getId(), show);
        return show;
    }

    public User createUser(String name, String email) {
        User user = new User(name, email);
        this.users.put(user.getId(), user);
        return user;
    }

    public List<Show> findShows(String title, String cityName) {
        List<Show> result = new ArrayList<>();
        this.shows.values().stream()
                .filter(show -> show.getMovie().getTitle().equalsIgnoreCase(title))
                .filter(show -> show.getScreen().getCinema().getCity().getName().equalsIgnoreCase(cityName))
                .forEach(result::add);
        return result;
    }

    public Booking bookTickets(String userId, String showId, List<Seat> seats){
        return this.bookingManager.createBooking(this.users.get(userId), this.shows.get(showId), seats);
    }
}
