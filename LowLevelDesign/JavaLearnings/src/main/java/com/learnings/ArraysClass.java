package com.learnings;

import java.util.*;

public class ArraysClass {

    public void execute() {
        int[] integerArray = new int[10];
        integerArray[5] = 50;
//        System.out.println("Element at index 5 " + integerArray[5]);

        int[] firstTen = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
//        System.out.println("Integer array length " + firstTen.length );

        // Enhanced For Loop
//        for(int num: firstTen) {
//            System.out.println("Integer array num " + num );
//        }

//        System.out.println("Integer array num " + Arrays.toString(firstTen) );
        int[] randomNumbers = generateRandomNumbers(10);
        System.out.println("Random numbers " + Arrays.toString(randomNumbers));
        Arrays.sort(randomNumbers);
        System.out.println("Random numbers after sorting" + Arrays.toString(randomNumbers));

        // Copy of Array
        int[] firstFullCopy = Arrays.copyOf(randomNumbers, randomNumbers.length);
        System.out.println("Print First Full Copy " + Arrays.toString(firstFullCopy));

        int[] largerArray = Arrays.copyOf(randomNumbers, 15);
        // [6, 18, 23, 23, 48, 61, 62, 64, 65, 98, 0, 0, 0, 0, 0]
        System.out.println("Larger Array " + Arrays.toString(largerArray));

        int[] smallerArray = Arrays.copyOf(randomNumbers, 5);
        System.out.println("Smaller Array " + Arrays.toString(smallerArray));

        int[] newArrayWithDefault = new int[10];
        Arrays.fill(newArrayWithDefault, 5);
        System.out.println("Array with default value " + Arrays.toString(newArrayWithDefault));

        String[] names = { "Anshuman", "Akanksha", "Atishay", "Adarsh"};
        Arrays.sort(names);

        if(Arrays.binarySearch(names, "Adarsh") >= 0 ) {
            System.out.println("Adarsh Found in names");
        } else {
            System.out.println("Adarsh not Found in names");
        }

        int[] s1 = { 1, 2, 3, 4, 5};
        int[] s2 = { 1, 2, 3, 4, 5};

        if(Arrays.equals(s1, s2)) {
            System.out.println("Both the arrays are equal");
        } else {
            System.out.println("Arrays are not equal");
        }

        int[] a = { 12, 34, 1, 8, 76, 5};
        Arrays.sort(a);
        System.out.println("Array after sorting " + Arrays.toString(a));

        Integer[] arr = { 5, 2, 8, 1, 9 };
        // Sort the array in descending order
        Arrays.sort(arr, Collections.reverseOrder());
        System.out.println("Array after sorting " + Arrays.toString(arr));

        // Convert Array into ArrayList
        String[] originalArray = {"First", "Second", "Third"};
        var originalList = Arrays.asList(originalArray);

        // Collections.sort(originalList, Collections.reverseOrder());
        originalList.sort(Comparator.reverseOrder());
        originalList.set(0, "first");
//        originalList.add("hello"); // Add and remove is not allowed as it is backed up by original array
        System.out.println("Original Array after sorting " + Arrays.toString(originalArray));
        System.out.println("Original Array List after sorting " + originalList);

    }

    public int[] generateRandomNumbers(int len) {
        Random random = new Random();
        int[] randomNumbers = new int[len];

        for(int i=0; i<len;i++) {
            randomNumbers[i] = random.nextInt(100);
        }
        return randomNumbers;
    }
}
