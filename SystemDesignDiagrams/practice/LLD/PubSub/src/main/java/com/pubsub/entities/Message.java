package com.pubsub.entities;

public class Message {
    private final String text;

    public Message(String text) {
        this.text = text;
    }

    public String getText() {
        return this.text;
    }
}
