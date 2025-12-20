package com.learnings;

import java.util.HashMap;
import java.util.Map;

public class ForLoop {
    public void execute() {
        for(int i=0; i<5;i++) {
            System.out.println("Number is " + i);
        }

//        for(double rate=2.0; rate <= 5.0; rate++) {
//            double interestAmount = calculateInterest(10000.0, rate);
//            System.out.println("10,000 at " + rate + " % interest = " + interestAmount);
//        }

        for(double rate=7.5; rate <= 10.0; rate+= 0.25) {
            double interestAmount = calculateInterest(100, rate);
            System.out.println("100 at " + rate + " % interest = " + interestAmount);
        }


        Map<String, Integer> scores = new HashMap<>();
        scores.put("hello", 1);
        scores.put("print", 2);

        scores.put(new String("print"), 4);


        System.out.println("Get value of print " + scores.get("print"));
        scores.putIfAbsent("great", 10);

        for(Map.Entry<String, Integer> s: scores.entrySet()) {
            System.out.println("Key" + s.getKey());
            System.out.println("Value" + s.getValue());
        }

        scores.forEach((key, value) -> {
            System.out.println(" Key is " + key);
            System.out.println("Value is " + value);
        });
    }

    public double calculateInterest(double amount, double rate) {
        return (amount * (rate / 100));
    }
}
