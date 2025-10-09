package com.atm.dispenserchain;

public class NoteDispenser implements DispenseChain {
    private DispenseChain nextChain;
    private Integer numNotes;
    private final Integer noteValue;

    public NoteDispenser(int noteValue, int numNotes) {
        this.noteValue = noteValue;
        this.numNotes = numNotes;
    }

    public void setNextChain(DispenseChain nextChain) {
        this.nextChain = nextChain;
    }

    @Override
    public synchronized void dispense(int amount) {
        if(amount >= noteValue) {
            int notesToDispense = Math.min(amount / noteValue, numNotes);
            int remainingAmount = amount - (notesToDispense * noteValue);
            this.numNotes -= notesToDispense;
            if(remainingAmount > 0 && this.nextChain != null) {
                this.nextChain.dispense(remainingAmount);
            }
        } else if(this.nextChain != null) {
            this.nextChain.dispense(amount);
        } else {
            System.out.println("Cannot dispense amount: " + amount);
        }
    }

    @Override
    public synchronized boolean canDispense(int amount) {
        if(amount < 0) {
            return false;
        }
        if(amount == 0) {
            return true;
        }
        int notesToDispense = Math.min(amount/noteValue, numNotes);
        int remainingAmount = amount - (notesToDispense * noteValue);

        if(remainingAmount == 0) {
            return true;
        }
        if(this.nextChain != null) {
            return this.nextChain.canDispense(remainingAmount);
        }
        return false;
    }


}
