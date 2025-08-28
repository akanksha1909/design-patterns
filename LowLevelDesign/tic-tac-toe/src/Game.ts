import { Board } from "./Board";
import { GameStatus } from "./enum/GameStatus";
import { Player } from "./Player";
import { GameState } from "./state/GameState";
import { InProgressState } from "./state/InProgress";
import { AntiDiagWinningStrategy } from "./strategy/AntiDiagWinningStrategy";
import { ColWinningStrategy } from "./strategy/ColWinningStrategy";
import { DiagonalWinningStrategy } from "./strategy/DiagonalWinningStrategy";
import { RowWinningStrategy } from "./strategy/RowWinningStrategy";
import { WinningStrategy } from "./strategy/WinningStrategy";

export class Game {
    public board: Board;
    public currentPlayer: Player;
    public status: GameStatus;
    public state: GameState;
    private winner!: Player;
    public winningStrategies: WinningStrategy[]
    constructor(public player1: Player, public player2: Player) {
        this.board = new Board(3);
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1; // Player 1 starts first
        this.status = GameStatus.INPROGRESS;
        this.state = new InProgressState();
        this.winningStrategies = [
            new RowWinningStrategy(),
            new ColWinningStrategy(),
            new DiagonalWinningStrategy(),
            new AntiDiagWinningStrategy()
        ]
    }

    setWinner(player: Player): void {
       this.winner = player;
    }

    getWinner(): Player {
        return this.winner;
    }

    setStatus(status: GameStatus): void {
        this.status = status;
    }

    setState(state: GameState): void {
        this.state = state; 
    }

    public makeMove(row: number, col: number, player: Player): void {
        this.state.handleMove(this, player, row, col);
    }

    public checkWinner(player: Player): boolean {
        for(const strategy of this.winningStrategies) {
            if(strategy.checkWinner(this.board, player)) {
                console.log(`Player ${player.name} has won the game!`);
                console.log(`Winning strategy: ${strategy.constructor.name}`);
                return true;
            }
        }
        return false;
    }

    public switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
}