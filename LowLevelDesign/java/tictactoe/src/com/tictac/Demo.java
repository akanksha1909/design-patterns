package com.tictac;

import com.tictac.entities.Player;
import com.tictac.enums.Symbol;

public class Demo {
    public static void main(String args[]) {

        TicTacToe system = TicTacToe.getInstance();
        Player alice = new Player("alice", Symbol.X);
        Player bob = new Player("bob", Symbol.O);

        system.createGame(alice, bob);

        system.makeMove(0, 0, alice);
        system.makeMove(1, 1, bob);
        system.makeMove(0, 1, alice);
        system.makeMove(2, 1, bob);
        system.makeMove(0, 2, alice);

    }
}
