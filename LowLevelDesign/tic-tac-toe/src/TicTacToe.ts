import { Game } from "./Game";
import { Player } from "./Player";
import { Scoreboard } from "./Scoreboard";
import { Symbol } from "./enum/Symbol";

export class TicTacToe {
    private static instance: TicTacToe;
    private game!: Game;
    private readonly scoreboard: Scoreboard;


    private constructor() {
        // Private constructor to prevent instantiation
        this.scoreboard = new Scoreboard();
    }

    static getInstance(): TicTacToe {
        if (!TicTacToe.instance) {
            TicTacToe.instance = new TicTacToe();
        }
        return TicTacToe.instance;
    }

    public createGame(player1: Player, player2: Player): void {
        this.game = new Game(player1, player2);
        this.game.registerObserver(this.scoreboard);
    }

    public printBoard(): void {
        this.game.board.printBoard();
    }

    public makeMove(row: number, col: number, player: Player): void {
        this.game.makeMove(row, col, player);
    }
}