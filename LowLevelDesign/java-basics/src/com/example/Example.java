package com.example;

import java.util.*;
public class Example {
    public static void main(String args[]) {
        // Basic Java Code Snippets
         Map<String, Integer> map = new HashMap<>();
         map.put("Alice", 100);
         map.put("Bob", 100);

         for(Map.Entry<String, Integer> entry: map.entrySet()) {
             System.out.println(entry.getKey());
             System.out.println(entry.getValue());
         }

         Map<String, Integer> filteredNames = new HashMap<>();
         map.forEach((key, value) -> {
             System.out.println("Hello Key " + key);
             System.out.println("Hello Value " + value);
             if(key.equals("Alice")) {
                 filteredNames.put(key, value);
             }
         });

         System.out.println("Filtered names" + filteredNames);

         Set<Integer> numbers = new HashSet<>();
         numbers.add(1);
         numbers.add(2);

         numbers.forEach(value -> {
             System.out.println("Set value " + value);
         });

         List<String> names = new ArrayList<>(Arrays.asList("alice", "bob"));
         names.add("charlie");
         for (String name: names) {
             System.out.println(name);
         }

//         Thread t1 = new Thread(new ThreadDemo("Worker-1"));
//         Thread t2 = new Thread(new ThreadDemo("Worker-2"));
//         Thread t3 = new Thread(new ThreadDemo("Worker-3"));
//
//        t1.start();
//        t2.start();
//        t3.start();

//        Output
//        Worker-3 - Count: 1 (Thread: Thread-2)
//        Worker-2 - Count: 1 (Thread: Thread-1)
//        Worker-1 - Count: 1 (Thread: Thread-0)
//        Worker-3 - Count: 2 (Thread: Thread-2)
//        Worker-2 - Count: 2 (Thread: Thread-1)
//        Worker-1 - Count: 2 (Thread: Thread-0)

//        SharedCounter task = new SharedCounter();
//
//        Thread t1 = new Thread(task, "Worker-1");
//        Thread t2 = new Thread(task, "Worker-2");
//        Thread t3 = new Thread(task, "Worker-3");
//
//        t1.start();
//        t2.start();
//        t3.start();
//
        int totalThreads = 3;

        for (int i = 0; i < totalThreads; i++) {
            Thread t = new Thread(new OrderedPrinter(i, totalThreads));
            t.start();
        }

    }
}