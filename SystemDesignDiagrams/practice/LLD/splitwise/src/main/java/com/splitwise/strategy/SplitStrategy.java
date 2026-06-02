package com.splitwise.strategy;

import com.splitwise.entities.Split;
import com.splitwise.entities.User;

import java.util.List;

public interface SplitStrategy {
    public List<Split> calculateSplits(double totalAmount, List<User> participants, List<Double> splitValues);
}