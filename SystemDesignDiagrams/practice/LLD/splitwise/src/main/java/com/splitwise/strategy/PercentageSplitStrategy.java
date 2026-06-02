package com.splitwise.strategy;

import com.splitwise.entities.Split;
import com.splitwise.entities.User;

import java.util.ArrayList;
import java.util.List;

public class PercentageSplitStrategy implements SplitStrategy {

    public List<Split> calculateSplits(double totalAmount, List<User> participants, List<Double> splitValues) {
        List<Split> splits = new ArrayList<>();
        for (int i=0; i < participants.size(); i++) {
            double amount = (totalAmount * splitValues.get(i)) / 100.0;
            splits.add(new Split(participants.get(i), amount));
        }
        return splits;
    }
}
