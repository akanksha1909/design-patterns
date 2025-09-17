package com.splitwise;

import com.splitwise.strategy.*;
import com.splitwise.User;

import java.util.List;

public class Expense {
    private final String id;
    private final String description;
    private  final double amount;
    private final User paidBy;
    private final List<User> participants;
    private final List<Split> splits;
    private Expense(ExpenseBuilder builder){
        this.id = builder.id;
        this.description = builder.description;
        this.amount = builder.amount;
        this.paidBy = builder.paidBy;
        this.participants = builder.participants;
        this.splits = builder.splitStrategy.calculateSplits(this.amount, this.paidBy, this.participants);
    }

    public String getId() {
        return this.id;
    }

    public String getDescription() {
        return this.description;
    }

    public List<User> getParticipants(){
        return this.participants;
    }

    public User getPaidBy(){
        return this.paidBy;
    }

    public List<Split> getSplits(){
        return this.splits;
    }

    public double getAmount(){
        return this.amount;
    }

    public static class ExpenseBuilder {
        private String id;
        private String description;
        private double amount;
        private User paidBy;
        private List<User> participants;
        private SplitStrategy splitStrategy;
        public ExpenseBuilder(){}

        public ExpenseBuilder setId(String id){
            this.id = id;
            return this;
        }

        public ExpenseBuilder setDescription(String description) {
            this.description = description;
            return this;
        }

        public ExpenseBuilder setAmount(double amount) {
            this.amount = amount;
            return this;
        }

        public ExpenseBuilder setPaidBy(User payer) {
            this.paidBy = payer;
            return this;
        }

        public ExpenseBuilder setParticipants(List<User> members) {
            this.participants = members;
            return this;
        }

        public ExpenseBuilder setSplitStrategy(SplitStrategy splitStrategy) {
            this.splitStrategy = splitStrategy;
            return this;
        }

        public Expense build(){
            return new Expense(this);
        }
    }
}
