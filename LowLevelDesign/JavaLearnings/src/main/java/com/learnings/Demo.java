package com.learnings;

import com.learnings.javathreads.ProducerConsumer;
import com.learnings.javathreads.RunningThread;
import com.learnings.javathreads.exercise.producerconsumerchallenge.DemoClass;
import com.learnings.javathreads.synchronizationEx.SyncDemo;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Demo {
    public static void main(String args[]) {
//        Switch switchClass = new Switch();
//        switchClass.execute();

//        ForLoop forLoopClass = new ForLoop();
//        forLoopClass.execute();

//        ArraysClass arraysClass = new ArraysClass();
//        arraysClass.execute();

//        CarClass oopClass = new CarClass();
//        oopClass.describeCar();

//        ListClass listClass = new ListClass();
//        listClass.execute();

//        LinkedListDemo linkedListDemo = new LinkedListDemo();
//        linkedListDemo.execute();

//        MultipleDimensionalArrays multidimensionalArray = new MultipleDimensionalArrays();
//        multidimensionalArray.execute();

//        DayOfTheWeek weekday = DayOfTheWeek.MONDAY;
//        System.out.println("Enum Demo " + weekday);

//        for(int i=0; i < 10; i++) {
//            DayOfTheWeek weekday = getRandomWeek();
//            System.out.printf("Name is %s and Ordinal Value is %d%n", weekday.name(), weekday.ordinal());
//            if(weekday == DayOfTheWeek.FRIDAY) {
//                System.out.println("Hurray! Found a Friday");
//            }
//        }

//        ThreadDemo threadDemo = new ThreadDemo();
//        threadDemo.execute();

       RunningThread runningThread = new RunningThread();
       runningThread.execute();


        // Excercise
//        ExcerciseDemo ed = new ExcerciseDemo();
//        ed.execute();

//        MultipleThreadDemo md = new MultipleThreadDemo();
//        md.execute();

//        SyncDemo syncBankaccountDemo  = new SyncDemo();
//        syncBankaccountDemo.execute();

//        ProducerConsumer pc = new ProducerConsumer();
//        pc.execute();

        // DemoClass dc = new DemoClass();
        // dc.execute();

//        EvenOdd evenOdd = new EvenOdd(15);
//        evenOdd.execute();
//        executorDemo();
//        completeableFutureDemo();

        // Asked in Oracle
//        MyBlockingQueue<Integer> queue = new MyBlockingQueue<>(5);
//        Thread p1 = new Thread(new Producer(queue), "Producer-1");
//        Thread p2 = new Thread(new Producer(queue), "Producer-2");
//        Thread c1 = new Thread(new Consumer(queue), "Consumer");
//
//        p1.start();
//        p2.start();
//        c1.start();


    }

    public static DayOfTheWeek getRandomWeek() {
        int randomNum = new Random().nextInt(7);
        var array = DayOfTheWeek.values();
        return array[randomNum];
    }

    public static void executorDemo(){
        try {
            ExecutorService executor = Executors.newFixedThreadPool(3);
            Future<Integer> future = executor.submit(() -> 12);
            int result =  future.get();
            System.out.println("Executor Service" + result); // Blocking
            executor.shutdown();
            System.out.println("Executor Hello");

        } catch (Exception e) {

        }
    }

    public static void completeableFutureDemo() {
        CompletableFuture.supplyAsync(() -> 5+2).thenApply(result -> result * 2)
                .thenAccept(System.out::println);

        System.out.println("Hello completeableFutureDemo");

    }
}
