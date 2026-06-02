package com.rating;

public class Demo {
    public void main(String[] args) {

        // Copy on Write Array Version
//        CopyOnWriteArrayListVersion customerRating = new CopyOnWriteArrayListVersion();

        // Atomic Variable (For high reads)
        AtomicVariableVersion customerRating = new AtomicVariableVersion();

        customerRating.addRating("Akanksha", 4);
        customerRating.addRating("Anshuman", 4);
        customerRating.addRating("Akanksha", 5);
        customerRating.addRating("Akanksha", 1);

        System.out.println(customerRating.getAvgRating("Akanksha"));
    }
}
