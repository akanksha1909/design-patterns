package com.splitwise.entities;

import com.splitwise.strategy.SplitStrategy;

import java.util.List;

public class Expense {

    private final String description;
    private final List<User> participants;
    private final User paidBy;
    private final double amount;
    private final List<Split> splits;

    private Expense(ExpenseBuilder builder) {
        this.description = builder.description;
        this.participants = builder.participants;
        this.paidBy = builder.paidBy;
        this.amount = builder.amount;
        this.splits = builder.splitStrategy.calculateSplits(builder.amount, builder.participants, builder.splitValues);
    }

    public String getDescription() {
        return this.description;
    }

    public List<User> getParticipants() {
        return this.participants;
    }

    public User getPaidBy() {
        return this.paidBy;
    }

    public double getAmount() {
        return this.amount;
    }

    public List<Split> getSplits() {
        return this.splits;
    }

    public static class ExpenseBuilder {

        private String description;
        private double amount;
        private User paidBy;
        private List<User> participants;
        private SplitStrategy splitStrategy;
        private List<Double> splitValues;

        public ExpenseBuilder setDescription(String name) {
             this.description = name;
             return this;
        }

        public ExpenseBuilder setPaidBy(User paidBy) {
            this.paidBy = paidBy;
            return this;
        }

        public ExpenseBuilder setParticipants(List<User> participants) {
            this.participants = participants;
            return this;
        }

        public ExpenseBuilder setAmount(double amount) {
            this.amount = amount;
            return this;
        }

        public ExpenseBuilder setSplitStrategy(SplitStrategy strategy) {
            this.splitStrategy = strategy;
            return this;
        }

        public ExpenseBuilder setSplitValues(List<Double> values) {
            this.splitValues = values;
            return this;
        }

        public Expense build() {
            return new Expense(this);
        }
    }
}
