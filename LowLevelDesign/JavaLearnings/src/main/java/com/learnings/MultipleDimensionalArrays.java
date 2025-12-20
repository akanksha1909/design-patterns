package com.learnings;

import java.util.Arrays;

public class MultipleDimensionalArrays {

    public void execute() {
        int[][] array1 = new int[4][4];

        System.out.println(Arrays.toString(array1));
        System.out.println("array1.length " + array1.length);

        for(int[] outer: array1) {
            System.out.println("array element " + Arrays.toString(outer));
        }

        for(var outer: array1) {
            for(var inner: outer) {
                System.out.print(inner + " ");
            }
            System.out.println();
        }

        System.out.println("Print Array " + Arrays.deepToString(array1));
    }
}
