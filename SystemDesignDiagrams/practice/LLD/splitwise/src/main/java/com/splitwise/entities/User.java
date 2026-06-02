package com.splitwise.entities;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class User {
    private final String name;
    private final BalanceSheet balanceSheet;
    private final String id;

    public User(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.balanceSheet = new BalanceSheet(this);
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public BalanceSheet getBalanceSheet() {
        return this.balanceSheet;
    }


}
