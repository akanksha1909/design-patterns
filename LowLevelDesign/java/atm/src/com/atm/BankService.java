package com.atm;

import com.atm.entities.Account;
import com.atm.entities.Card;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class BankService {
    private static BankService instance;
    private Map<String, Account> accounts = new ConcurrentHashMap<>();
    private Map<String, Card> cards = new ConcurrentHashMap<>();
    private Map<Card, Account> cardAccountMap = new ConcurrentHashMap<>();

    private BankService() {
        Account account = createAccount("1234567", 1000.0);
        Card card = createCard("123455555", "1234");
        linkCardToAccount(card, account);
    }

    public static synchronized BankService getInstance() {
        if(instance == null) {
            instance = new BankService();
        }
        return instance;
    }

    public Card createCard(String cardNumber, String pin) {
       Card card = new Card(cardNumber, pin);
       this.cards.put(cardNumber, card);
       return card;
    }

    public Account createAccount(String accountNumber, double amount) {
        Account account = new Account(accountNumber, amount);
        this.accounts.put(accountNumber, account);
        return account;
    }

    public void linkCardToAccount(Card card, Account account) {
        this.cardAccountMap.put(card, account);
    }

    public Card getCard(String cardNumber) {
        return this.cards.get(cardNumber);
    }

    public double getBalance(Card card) {
        return this.cardAccountMap.get(card).getBalance();
    }
}
