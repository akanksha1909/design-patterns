import { Game } from "./Game";
import { Player } from "./Player";
import { Symbol } from "./enum/Symbol";

export class TicTacToe {
    private static instance: TicTacToe;
    private game!: Game;

    private constructor() {
        // Private constructor to prevent instantiation
    }

    static getInstance(): TicTacToe {
        if (!TicTacToe.instance) {
            TicTacToe.instance = new TicTacToe();
        }
        return TicTacToe.instance;
    }

    public createGame(player1: Player, player2: Player): void {
        this.game = new Game(player1, player2);
    }

    public printBoard(): void {
        this.game.board.printBoard();
    }

    public makeMove(row: number, col: number, player: Player): void {
        this.game.makeMove(row, col, player);
    }
}