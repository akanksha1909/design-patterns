package com.tictac.observer;

import com.tictac.entities.Game;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Scoreboard implements GameObserver{
    private Map<String, Integer> scores;

    public Scoreboard() {
        this.scores =  new ConcurrentHashMap<>();
    }

    public void update(Game game) {
        if(game.getWinner() != null) {
            String winnerName = game.getWinner().getName();
            this.scores.put(winnerName, scores.getOrDefault(winnerName, 0) + 1);
            System.out.printf("[Scoreboard] %s wins! Their new score is %d.%n", winnerName, scores.get(winnerName));
        }
    }
}
