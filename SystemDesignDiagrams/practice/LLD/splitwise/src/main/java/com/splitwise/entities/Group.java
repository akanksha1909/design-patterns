package com.splitwise.entities;

import java.util.List;
import java.util.UUID;

public class Group {
    private String id;
    private final String name;
    private final List<User> participants;
    public Group(String name, List<User> participants) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.participants = participants;
    }

    public String getId() {
        return this.id;
    }

    public List<User> getMembers() {
        return this.participants;
    }
}
