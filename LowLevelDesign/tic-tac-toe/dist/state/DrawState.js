"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawState = void 0;
class DrawState {
    constructor() {
    }
    handleMove(game, player, row, col) {
        throw new Error("Game ended in a draw. No more moves allowed.");
    }
}
exports.DrawState = DrawState;
