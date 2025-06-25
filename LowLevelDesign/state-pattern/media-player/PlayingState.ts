import { MediaPlayer } from "./MediaPlayer";
import { PausedState } from "./PausingState";
import { State } from "./State";

export class PlayingState implements State {
    pressPlay(player: MediaPlayer): void {
        console.log("Pausing playback...");
        player.setState(new PausedState());
    }
}