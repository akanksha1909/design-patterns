package com.splitwise;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SplitwiseApplication {
    private static SplitwiseApplication instance;
    private final Map<String, User> users = new HashMap<>();
    private final Map<String, Group> groups = new HashMap<>();
    private SplitwiseApplication(){}
    // Make it thread safe
    public static synchronized SplitwiseApplication getInstance(){
        if(instance == null) {
            instance = new SplitwiseApplication();
        }
        return instance;
    }

    public User createUser(String name, String email) {
        User user = new User(name, email);
        users.put(user.getId(), user);
        return user;
    }

    public Group createGroup(String name, List<User> members) {
        Group group = new Group(name, members);
        groups.put(group.getId(), group);
        return group;
    }

    public void createExpense(Expense.ExpenseBuilder builder){
        Expense expense = builder.build();
        System.out.println("Expense entity");
        System.out.println(expense.getParticipants());
        User paidBy = expense.getPaidBy();
        for (Split split: expense.getSplits()) {
            User participant = split.getUser();
            double amount = split.getAmount();
            if(!paidBy.equals(participant)) {
                paidBy.getBalanceSheet().adjustBalance(participant, amount);
                participant.getBalanceSheet().adjustBalance(paidBy, -amount);
            }
        }
        System.out.println("Expense for " + expense.getDescription() + " of amount " + expense.getAmount() + " is created");
    }

    public void showBalanceSheet(String userId) {
        User user = users.get(userId);
        user.getBalanceSheet().showBalances();
    }
}
