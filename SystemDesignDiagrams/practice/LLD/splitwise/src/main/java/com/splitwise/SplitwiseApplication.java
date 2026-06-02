package com.splitwise;

import com.splitwise.entities.*;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Math.min;

public class SplitwiseApplication {
    public static SplitwiseApplication instance;
    private final Map<String, Group> groups = new HashMap<>();
    private final Map<String, User> users = new HashMap<>();

    public static SplitwiseApplication getInstance() {
            if(SplitwiseApplication.instance == null) {
                SplitwiseApplication.instance = new SplitwiseApplication();
            }
            return SplitwiseApplication.instance;
    }

    public User addUser(String name) {
        User user = new User(name);
        users.put(user.getId(), user);
        return user;
    }

    public Group createGroup(String name, List<User> members) {
        Group group = new Group(name, members);
        this.groups.put(group.getId(), group);
        return group;
    }

    public synchronized void createExpense(Expense.ExpenseBuilder builder) {
        Expense expense = builder.build();
        User paidBy = expense.getPaidBy();

        for(Split split: expense.getSplits()) {
            User participant = split.getUser();
            double amount = split.getAmount();
            if(!paidBy.equals(participant)) {
                paidBy.getBalanceSheet().adjustBalance(participant, amount);
                participant.getBalanceSheet().adjustBalance(paidBy, -amount);
            }
        }
        System.out.println("Expense '" + expense.getDescription() + "' of amount " + expense.getAmount() + " created.");
    }

    public List<Transaction> simplifyGroupDebts(String groupId) {
        Group group = groups.get(groupId);
        Map<User, Double> netBalances = new HashMap<>();
        for(User member: group.getMembers()) {
            double balance = 0;
            for(Map.Entry<User, Double> entry: member.getBalanceSheet().getBalances().entrySet()) {
                if(group.getMembers().contains(entry.getKey())) {
                    balance += entry.getValue();
                }
            }
            netBalances.put(member, balance);
        }

        // Seperate into Creditors and Debtors
        List<Map.Entry<User, Double>> creditors = netBalances.entrySet().stream().filter(e -> e.getValue() > 0).collect(Collectors.toList());
        List<Map.Entry<User, Double>> debtors = netBalances.entrySet().stream().filter(e -> e.getValue() < 0).collect(Collectors.toList());

        creditors.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));
        debtors.sort(Map.Entry.comparingByValue());

        List<Transaction> transactions = new ArrayList<>();
        int i=0, j=0;
        while(i < creditors.size() && j < debtors.size()) {
            Map.Entry<User, Double> creditor = creditors.get(i);
            Map.Entry<User, Double> debtor = debtors.get(i);

            // Let the debtor pay as much as possible, but not more than what the creditor needs.
            double amountToSettle = min(creditor.getValue(), -debtor.getValue());
            transactions.add(new Transaction(creditor.getKey(), debtor.getKey(), amountToSettle));

            creditor.setValue(creditor.getValue() - amountToSettle);
            debtor.setValue(debtor.getValue() + amountToSettle);

            System.out.println("Transactions....." + transactions);

            if(Math.abs(creditor.getValue()) < 0.01) {
                i += 1;
            }
            if(Math.abs(debtor.getValue()) < 0.01) {
                j += 1;
            }
        }
        return transactions;
    }



    public synchronized void settleUp(String payerId, String payeeId, double amount) {
        User payer = users.get(payerId);
        User payee = users.get(payeeId);
        System.out.println(payer.getName() + " is settling up " + amount + " with " + payee.getName());
        // Settlement is like a reverse expense. payer owes less to payee.

        payee.getBalanceSheet().adjustBalance(payer, -amount);
        payer.getBalanceSheet().adjustBalance(payee, amount);
    }

}
