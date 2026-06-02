package com.tictactoe;

import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;
import com.tictactoe.enums.Symbol;

public class Demo {
    public static void main(String args[]) {
        Player alice = new Player("Alice", Symbol.X);
        Player bob = new Player("Bob", Symbol.Y);

        TicTacToeApplication system = TicTacToeApplication.getInstance();

        // --- GAME 1: Alice wins ---
        System.out.println("--- GAME 1: Alice (X) vs. Bob (O) ---");
        system.createGame(alice, bob);

        system.makeMove(alice, 0, 0);
        system.makeMove(bob, 1, 0);
        system.makeMove(alice, 0, 1);
        system.makeMove(bob, 1, 1);
        system.makeMove(alice, 0, 2); // Alice wins, scoreboard is notified
        system.printBoard();
        System.out.println("----------------------------------------\n");

        // --- GAME 2: Bob wins ---
        System.out.println("--- GAME 2: Alice (X) vs. Bob (O) ---");
        system.createGame(alice, bob); // A new game instance

        system.makeMove(alice, 0, 0);
        system.makeMove(bob, 1, 0);
        system.makeMove(alice, 0, 1);
        system.makeMove(bob, 1, 1);
        system.makeMove(alice, 2, 2);
        system.makeMove(bob, 1, 2); // Bob wins, scoreboard is notified
        system.printBoard();
        System.out.println("----------------------------------------\n");

        // --- GAME 3: A Draw ---
        System.out.println("--- GAME 3: Alice (X) vs. Bob (O) - Draw ---");
        system.createGame(alice, bob);

        system.makeMove(alice, 0, 0);
        system.makeMove(bob, 0, 1);
        system.makeMove(alice, 0, 2);
        system.makeMove(bob, 1, 1);
        system.makeMove(alice, 1, 0);
        system.makeMove(bob, 1, 2);
        system.makeMove(alice, 2, 1);
        system.makeMove(bob, 2, 0);
        system.makeMove(alice, 2, 2); // Draw, scoreboard is not notified of a winner
        system.printBoard();
        System.out.println("----------------------------------------\n");

        // --- GAME 4: Alice wins ---
        System.out.println("--- GAME 4: Alice (X) vs. Bob (O) ---");
        system.createGame(alice, bob);

        system.makeMove(alice, 0, 0);
        system.makeMove(bob, 1, 0);
        system.makeMove(alice, 0, 1);
        system.makeMove(bob, 1, 1);
        system.makeMove(alice, 0, 2); // Alice wins, scoreboard is notified
        system.printBoard();
        System.out.println("----------------------------------------\n");

        // --- Final Scoreboard ---
        // We get the scoreboard from the system and print its final state
        system.printScoreBoard();
    }
}
