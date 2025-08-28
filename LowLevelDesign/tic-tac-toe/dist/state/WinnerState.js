"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinnerState = void 0;
class WinnerState {
    constructor() {
    }
    handleMove(game, player, row, col) {
        // No action needed as the game has already been won
        throw new Error(`Game already won by ${game.getWinner()?.name}. No more moves allowed.`);
    }
}
exports.WinnerState = WinnerState;
