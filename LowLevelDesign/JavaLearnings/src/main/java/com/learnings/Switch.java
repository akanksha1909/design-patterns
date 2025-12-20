package com.learnings;

public class Switch {
    public Switch() {

    }

    void execute() {
        int value = 2;
        switch (value) {
            case 1: {
                System.out.println("Value was 1");
                break;
            }
            case 2: {
                System.out.println("Value was 2");
                break;
            }
            default: {
                System.out.println("Value was neither 1 nor 2");
                break;
            }
        }
    }
}
