import { State } from "./State";
import { StoppedState } from "./StoppedState";

export class MediaPlayer {
    private _state;
    constructor() {
        this._state = new StoppedState();
    }

    setState(state: State) {
        this._state = state;
    }

    pressPlay(): void {
       this._state.pressPlay(this); 
    }

}