package com.splitwise.strategy;

import com.splitwise.entities.Split;
import com.splitwise.entities.User;

import java.util.ArrayList;
import java.util.List;

public class EqualSplitStrategy implements SplitStrategy {
    public List<Split> calculateSplits(double totalAmount, List<User> participants, List<Double> splitValues) {
        List<Split> splits = new ArrayList<>();
        double splitPerUser = totalAmount / participants.size();
        for (User participant : participants) {
            splits.add(new Split(participant, splitPerUser));
        }
        return splits;
    }
}
