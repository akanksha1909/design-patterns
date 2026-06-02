import { Game } from './entities/Game.js'

class TicTacToeApplication {
  
    createGame(playerX, playerO) {
        const game = new Game(playerX, playerO);
        return game;
    }

    makeMove(game, row, col, player) {
        game.makeMove(row, col, player)  
    }
}

export const tictacToeApplication = new TicTacToeApplication();