package com.atm;

import com.atm.state.AtmState;

public class AtmApplication {
    private static AtmApplication instance;
    private AtmState currentState;
    private AtmApplication(){

    }

    public static synchronized AtmApplication getInstance() {
        if(instance == null) {
            instance = new AtmApplication();
        }
        return instance;
    }

    public void insertCard() {

    }
}
