package com.splitwise.strategy;
import java.util.List;

import com.splitwise.*;


public interface SplitStrategy {
    public List<Split> calculateSplits(double totalAmount, User paidBy, List<User> participants);
}
