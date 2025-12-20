package com.learnings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class ListClass {

    public void execute() {
//        ArrayList<String> animals = new ArrayList<>();
//        animals.add("Dog");
//        animals.add("Cat");
//
//        animals.remove(0);
//
//        System.out.println(animals);

        String[] animals = {"Dog", "Cat", "Monkey"};
        List<String> list = List.of(animals);
//        list.add("Deer"); // Not allowed, will throw immutable error

        ArrayList<String> animalsArrayList = new ArrayList<>(list);
        animalsArrayList.add("Deer");
        System.out.println(animalsArrayList);
        System.out.println("Third animal from the list " + animalsArrayList.get(2));


//        animalsArrayList.retainAll(List.of("Deer", "Cat"));
//        System.out.println("Animal list after calling retailAll function " + animalsArrayList);

        animalsArrayList.removeAll(List.of("Dog", "Cat"));
        System.out.println("Animal list after removing " + animalsArrayList);


        animalsArrayList.clear(); // Deletes all the element
        System.out.println("Animal list Length " + animalsArrayList.isEmpty() );

        animalsArrayList.addAll(List.of("Peacock", "Owl"));
        System.out.println("Animal list after calling addAll " + animalsArrayList);

        animalsArrayList.sort(Comparator.naturalOrder());
        System.out.println("Animal list after sorting " + animalsArrayList);

        animalsArrayList.sort(Comparator.reverseOrder());
        System.out.println("Animal list after sorting in reverse " + animalsArrayList);

        var animalsArrayListOne = animalsArrayList.toArray(new String[animalsArrayList.size()]);
        System.out.println("New Animals array list " + Arrays.toString(animalsArrayListOne));

        if(animalsArrayList.contains("Peacock")) {
            System.out.println("Animals list contains Peacock");
        }




    }
}
