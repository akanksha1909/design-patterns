package com.learnings;

import java.util.LinkedList;

public class LinkedListDemo {
    public void execute() {
//        LinkedList<String> placesToVisit = new LinkedList<>();
        var placesToVisit = new LinkedList<String>();
        placesToVisit.add("Sydney");
        placesToVisit.add(0, "Canberra");
        System.out.println(placesToVisit);

        addMoreElements(placesToVisit);
        System.out.println(placesToVisit);

        removeElements(placesToVisit);
        System.out.println(placesToVisit);
    }

    private static void addMoreElements(LinkedList<String> list) {
        list.addFirst("Darwin");
        list.addLast("Hobart");

        // Queue methods
        list.offer("Melbourne");
        list.offerFirst("Brisbane");
        list.offerFirst("Toowoomba");

        // Stack Methods
        list.push("Alice Springs"); // will add to head
    }

    private static void removeElements(LinkedList<String> list) {
        list.remove(4);
        list.remove("Brisbane");

        list.remove(); // Removes first element
        System.out.println(list);

        // Queue/ Deque Poll Methods
        String p1 = list.poll(); // Removes First element
        String p2 = list.pollFirst(); // Removes First element

        list.pollLast(); // Removes last element

        System.out.println(list);

        // Stack methods
        list.push("Melbourne");
        list.push("Brisbane");
        list.push("Toowoomba");

        list.pop(); // Removes First element
        System.out.println(list);
    }
}
