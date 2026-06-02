package com.tictactoe.observer;

import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Scoreboard implements GameObserver {
    private Map<Player, Integer> scores;
    public Scoreboard() {
        this.scores = new ConcurrentHashMap<>();
    }

    public void onUpdate(Game game) {
        if (game.getWinner() != null) {
            this.scores.put(game.getWinner(), scores.getOrDefault(game.getWinner(), 0) + 1);
            System.out.printf("[Scoreboard] Winner is %s and the total score is %d%n " , game.getWinner().getName(), this.scores.get(game.getWinner()));
        }
    }

    public void printScores() {
        for(Map.Entry<Player, Integer> score: scores.entrySet()) {
            System.out.println("Details " + score.getKey().getName());
            System.out.println("Details " + score.getValue());

        }
    }
}
