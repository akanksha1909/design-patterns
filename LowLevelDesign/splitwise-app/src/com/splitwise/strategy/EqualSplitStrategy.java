package com.splitwise.strategy;
import java.util.ArrayList;
import java.util.List;
import com.splitwise.*;

public class EqualSplitStrategy implements SplitStrategy {
    public EqualSplitStrategy(){}

    public List<Split> calculateSplits(
            double totalAmount, User paidBy, List<User> participants){
        double amountPerPerson = totalAmount / participants.size();
        List<Split> splits = new ArrayList<>();
        for (User participant: participants) {
            splits.add(new Split(participant, amountPerPerson));
        }
        System.out.println(splits);
        return splits;
    }
}
