package com.notification;

public class Recipient {
    private final String name;
    private final String email;

    public Recipient(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }
}
