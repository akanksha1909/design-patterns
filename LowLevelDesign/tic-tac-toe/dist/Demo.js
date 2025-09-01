"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const TicTacToe_1 = require("./TicTacToe");
const Symbol_1 = require("./enum/Symbol");
class Demo {
    run() {
        const ticTacToe = TicTacToe_1.TicTacToe.getInstance();
        const alice = new Player_1.Player("Alice", Symbol_1.Symbol.X);
        const bob = new Player_1.Player("Bob", Symbol_1.Symbol.O);
        // Game 1: Alice wins
        console.log("--- GAME 1: Alice (X) vs. Bob (O) ---");
        ticTacToe.createGame(alice, bob);
        // ticTacToe.printBoard();
        ticTacToe.makeMove(0, 0, alice);
        ticTacToe.makeMove(1, 0, bob);
        ticTacToe.makeMove(0, 1, alice);
        ticTacToe.makeMove(1, 1, bob);
        ticTacToe.makeMove(0, 2, alice); // Alice wins, scoreboard is notified
        ticTacToe.printBoard();
        // --- GAME 2: Bob wins ---
        console.log("--- GAME 2: Alice (X) vs. Bob (O) ---");
        ticTacToe.createGame(alice, bob); // A new game instance
        ticTacToe.makeMove(0, 0, alice);
        ticTacToe.makeMove(1, 0, bob);
        ticTacToe.makeMove(0, 1, alice);
        ticTacToe.makeMove(1, 1, bob);
        ticTacToe.makeMove(2, 2, alice);
        ticTacToe.makeMove(1, 2, bob); // Bob wins, scoreboard is notified
        ticTacToe.printBoard();
        console.log("----------------------------------------\n");
        // --- GAME 3: A Draw ---
        console.log("--- GAME 3: Alice (X) vs. Bob (O) - Draw ---");
        ticTacToe.createGame(alice, bob);
        ticTacToe.makeMove(0, 0, alice);
        ticTacToe.makeMove(0, 1, bob);
        ticTacToe.makeMove(0, 2, alice);
        ticTacToe.makeMove(1, 1, bob);
        ticTacToe.makeMove(1, 0, alice);
        ticTacToe.makeMove(1, 2, bob);
        ticTacToe.makeMove(2, 1, alice);
        ticTacToe.makeMove(2, 0, bob);
        ticTacToe.makeMove(2, 2, alice); // Draw, scoreboard is not notified of a winner
        ticTacToe.printBoard();
        console.log("----------------------------------------\n");
    }
}
new Demo().run();
