package com.fooddelivery.entities;

public class Address {
    private final String street;
    private final String city;
    private final String zipcode;
    private final double latitude;
    private final double longitude;
    public Address(String street, String city, String zipcode, double latitude, double longitude) {
        this.street = street;
        this.city = city;
        this.zipcode = zipcode;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getCity() {
        return this.city;
    }
}
