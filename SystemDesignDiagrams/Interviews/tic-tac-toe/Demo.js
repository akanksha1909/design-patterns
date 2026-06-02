import { tictacToeApplication } from './TicTacToeApplication.js';
import { Player } from './entities/Player.js'
class Demo {
    run() {
        const playerX = new Player("X")
        const playerO = new Player("O")
        let game = tictacToeApplication.createGame(playerX, playerO);
        tictacToeApplication.makeMove(game, 1, 1, playerX);
        tictacToeApplication.makeMove(game, 0, 2, playerO);
        tictacToeApplication.makeMove(game, 0, 0, playerX);
        tictacToeApplication.makeMove(game, 1, 0, playerO);
        tictacToeApplication.makeMove(game, 2, 0, playerX);

        tictacToeApplication.makeMove(game, 2, 1, playerO);
        tictacToeApplication.makeMove(game, 0, 1, playerX);
        tictacToeApplication.makeMove(game, 2, 2, playerO);
        tictacToeApplication.makeMove(game, 1, 2, playerX);



        game.printBoard();
    }
}

new Demo().run()

